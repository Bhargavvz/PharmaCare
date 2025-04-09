package com.pharmacare.api.controller;

import com.pharmacare.api.dto.BillDto;
import com.pharmacare.api.dto.CreateBillItemDto;
import com.pharmacare.api.dto.CreateBillRequestDto;
import com.pharmacare.api.dto.BillItemDto;
import com.pharmacare.api.dto.ErrorResponseDto;
import com.pharmacare.api.exception.InsufficientStockException;
import com.pharmacare.api.exception.ResourceNotFoundException;
import com.pharmacare.api.model.*;
import com.pharmacare.api.repository.*;
import com.pharmacare.api.security.CurrentUser;
import com.pharmacare.api.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillingController {

    private static final Logger logger = LoggerFactory.getLogger(BillingController.class);

    private final BillRepository billRepository;
    private final BillItemRepository billItemRepository;
    private final InventoryRepository inventoryRepository;
    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;
    private final PharmacyStaffRepository pharmacyStaffRepository;

    // TODO: Implement GET endpoints for fetching bills (list, single)

    @PostMapping
    @PreAuthorize("hasRole('PHARMACY') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> createBill(@Valid @RequestBody CreateBillRequestDto requestDto,
                                        @CurrentUser UserPrincipal currentUserPrincipal) {
        try {
            logger.info("Attempting to create bill for pharmacy ID: {}", requestDto.getPharmacyId());

            Pharmacy pharmacy = pharmacyRepository.findById(requestDto.getPharmacyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pharmacy", "id", requestDto.getPharmacyId()));

             boolean isAdmin = currentUserPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
                
            if (!isAdmin) {
                 boolean isMember = pharmacyStaffRepository.findByUserId(currentUserPrincipal.getId()).stream()
                                              .anyMatch(staff -> staff.getPharmacy().getId().equals(requestDto.getPharmacyId()));
                 if (!isMember) {
                     logger.warn("User {} attempted to create bill for pharmacy {} without authorization", currentUserPrincipal.getEmail(), requestDto.getPharmacyId());
                    throw new AccessDeniedException("User is not authorized to create bills for this pharmacy.");
                 }
            }

            User createdBy = userRepository.findById(currentUserPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserPrincipal.getId()));

            User customer = null;
            if (requestDto.getCustomerId() != null) {
                customer = userRepository.findById(requestDto.getCustomerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Customer User", "id", requestDto.getCustomerId()));
            }
            if (customer == null && (requestDto.getCustomerName() == null || requestDto.getCustomerName().isBlank())) {
                 return ResponseEntity.badRequest().body(new ErrorResponseDto("Customer name is required if customer ID is not provided."));
            }

            List<BillItem> billItems = new ArrayList<>();
            BigDecimal calculatedSubtotal = BigDecimal.ZERO;
            BigDecimal calculatedTotalTax = Optional.ofNullable(requestDto.getTaxAmount()).orElse(BigDecimal.ZERO);
            BigDecimal calculatedDiscount = Optional.ofNullable(requestDto.getDiscountAmount()).orElse(BigDecimal.ZERO);

            for (CreateBillItemDto itemDto : requestDto.getItems()) {
                Inventory inventoryItem = inventoryRepository.findById(itemDto.getInventoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Inventory Item", "id", itemDto.getInventoryId()));

                if (!inventoryItem.getPharmacy().getId().equals(pharmacy.getId())) {
                    throw new IllegalArgumentException("Inventory item " + itemDto.getInventoryId() + " does not belong to pharmacy " + pharmacy.getId());
                }

                if (inventoryItem.getQuantity() < itemDto.getQuantity()) {
                    throw new InsufficientStockException("Insufficient stock for item: " + inventoryItem.getMedicationName() +
                            " (Requested: " + itemDto.getQuantity() + ", Available: " + inventoryItem.getQuantity() + ")");
                }

                inventoryItem.setQuantity(inventoryItem.getQuantity() - itemDto.getQuantity());

                BigDecimal itemSubtotal = inventoryItem.getSellingPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
                BigDecimal itemDiscount = BigDecimal.ZERO; 
                BigDecimal itemTax = BigDecimal.ZERO; 
                BigDecimal itemTotal = itemSubtotal.subtract(itemDiscount).add(itemTax);

                BillItem billItem = BillItem.builder()
                        .inventory(inventoryItem)
                        .itemName(inventoryItem.getMedicationName()) 
                        .quantity(itemDto.getQuantity())
                        .unitPrice(inventoryItem.getSellingPrice())
                        .subtotal(itemSubtotal)
                        .discountAmount(itemDiscount) 
                        .taxAmount(itemTax)
                        .totalAmount(itemTotal)
                        .build();
                billItems.add(billItem);

                calculatedSubtotal = calculatedSubtotal.add(itemSubtotal);
            }
            
            BigDecimal calculatedTotal = calculatedSubtotal.subtract(calculatedDiscount).add(calculatedTotalTax);

            Bill bill = Bill.builder()
                    .pharmacy(pharmacy)
                    .customer(customer)
                    .customerName(customer != null ? (customer.getFirstName() + " " + customer.getLastName()) : requestDto.getCustomerName()) 
                    .customerPhone(requestDto.getCustomerPhone())
                    .customerEmail(requestDto.getCustomerEmail())
                    .billDate(LocalDateTime.now())
                    .subtotal(calculatedSubtotal)
                    .taxAmount(calculatedTotalTax)
                    .discountAmount(calculatedDiscount)
                    .totalAmount(calculatedTotal) 
                    .paymentStatus(requestDto.getPaymentStatus())
                    .paymentMethod(requestDto.getPaymentMethod())
                    .createdBy(createdBy)
                    .notes(requestDto.getNotes())
                    .prescriptionReference(requestDto.getPrescriptionReference())
                    .items(billItems)
                    .build();
            
            billItems.forEach(item -> item.setBill(bill));

            Bill savedBill = billRepository.save(bill);
            logger.info("Successfully created bill with ID: {} and Number: {}", savedBill.getId(), savedBill.getBillNumber());
            
            BillDto responseDto = convertToDto(savedBill);

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);

        } catch (ResourceNotFoundException e) {
            logger.warn("Resource not found during bill creation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDto(e.getMessage()));
        } catch (InsufficientStockException e) {
            logger.warn("Insufficient stock during bill creation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponseDto(e.getMessage()));
        } catch (AccessDeniedException e) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponseDto(e.getMessage()));
        } catch (IllegalArgumentException e) {
             logger.warn("Invalid argument during bill creation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDto(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating bill: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("An unexpected error occurred while creating the bill."));
        }
    }
    
    private BillDto convertToDto(Bill bill) {
        List<BillItemDto> itemDtos = bill.getItems().stream()
            .map(this::convertItemToDto)
            .collect(Collectors.toList());

        return BillDto.builder()
            .id(bill.getId())
            .billNumber(bill.getBillNumber())
            .pharmacyId(bill.getPharmacy().getId())
            .pharmacyName(bill.getPharmacy().getName())
            .customerId(bill.getCustomer() != null ? bill.getCustomer().getId() : null)
            .customerName(bill.getCustomerName()) 
            .customerPhone(bill.getCustomerPhone())
            .customerEmail(bill.getCustomerEmail())
            .billDate(bill.getBillDate())
            .subtotal(bill.getSubtotal())
            .taxAmount(bill.getTaxAmount())
            .discountAmount(bill.getDiscountAmount())
            .totalAmount(bill.getTotalAmount())
            .paymentStatus(bill.getPaymentStatus())
            .paymentMethod(bill.getPaymentMethod())
            .createdById(bill.getCreatedBy() != null ? bill.getCreatedBy().getId() : null)
            .createdByName(bill.getCreatedBy() != null ? bill.getCreatedBy().getFirstName() + " " + bill.getCreatedBy().getLastName() : null)
            .items(itemDtos)
            .prescriptionReference(bill.getPrescriptionReference())
            .notes(bill.getNotes())
            .createdAt(bill.getCreatedAt())
            .updatedAt(bill.getUpdatedAt())
            .build();
    }

    private BillItemDto convertItemToDto(BillItem item) {
        return BillItemDto.builder()
            .id(item.getId())
            .billId(item.getBill().getId())
            .billNumber(item.getBill().getBillNumber())
            .inventoryId(item.getInventory() != null ? item.getInventory().getId() : null)
            .itemName(item.getItemName())
            .quantity(item.getQuantity())
            .unitPrice(item.getUnitPrice())
            .subtotal(item.getSubtotal())
            .discountAmount(item.getDiscountAmount())
            .taxAmount(item.getTaxAmount())
            .totalAmount(item.getTotalAmount())
            .createdAt(item.getCreatedAt())
            .updatedAt(item.getUpdatedAt())
            .build();
    }
} 
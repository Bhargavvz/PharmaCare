package com.pharmacare.api.controller;

import com.pharmacare.api.dto.ErrorResponseDto;
import com.pharmacare.api.dto.InventoryDto;
import com.pharmacare.api.exception.ResourceNotFoundException;
import com.pharmacare.api.model.Inventory;
import com.pharmacare.api.model.Pharmacy;
import com.pharmacare.api.repository.InventoryRepository;
import com.pharmacare.api.repository.PharmacyRepository;
import com.pharmacare.api.security.CurrentUser;
import com.pharmacare.api.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {

    private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PharmacyRepository pharmacyRepository;

    @GetMapping("/{pharmacyId}/items")
    @PreAuthorize("hasRole('ADMIN') or @pharmacySecurityService.isPharmacyMember(#pharmacyId, principal)")
    public ResponseEntity<List<InventoryDto>> getInventory(
            @PathVariable Long pharmacyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Inventory.MedicationType type,
            @RequestParam(required = false) Boolean lowStock,
            @RequestParam(required = false) Boolean expiring,
            @CurrentUser UserPrincipal currentUser) {

        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + pharmacyId));

        List<Inventory> inventoryItems;

        final int EXPIRY_THRESHOLD_DAYS = 30;
        LocalDate expiryLimitDate = LocalDate.now().plusDays(EXPIRY_THRESHOLD_DAYS);

        if (search != null && !search.isEmpty()) {
            inventoryItems = inventoryRepository.findByPharmacyAndMedicationNameContainingIgnoreCase(pharmacy, search);
        } else if (type != null) {
            inventoryItems = inventoryRepository.findByPharmacyAndMedicationType(pharmacy, type);
        } else if (Boolean.TRUE.equals(lowStock)) {
            inventoryItems = inventoryRepository.findLowStockItems(pharmacy);
        } else if (Boolean.TRUE.equals(expiring)) {
            inventoryItems = inventoryRepository.findExpiringBetween(pharmacy, LocalDate.now(), expiryLimitDate);
        } else {
            inventoryItems = inventoryRepository.findByPharmacyAndActive(pharmacy, true);
        }

        List<InventoryDto> inventoryDtos = inventoryItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(inventoryDtos);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or @pharmacySecurityService.isPharmacyMember(#pharmacyId, principal)")
    public ResponseEntity<Map<String, Long>> getInventoryStats(
        @RequestParam Long pharmacyId,
        @CurrentUser UserPrincipal currentUser) {
        
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + pharmacyId));
        
        final int EXPIRY_THRESHOLD_DAYS = 30;
        LocalDate expiryLimitDate = LocalDate.now().plusDays(EXPIRY_THRESHOLD_DAYS);

        long totalItems = inventoryRepository.countByPharmacyAndActive(pharmacy, true);
        long lowStockCount = inventoryRepository.countLowStockItems(pharmacy);
        long expiringSoonCount = inventoryRepository.countExpiringBetween(pharmacy, LocalDate.now(), expiryLimitDate);

        Map<String, Long> stats = Map.of(
            "totalItems", totalItems,
            "lowStockCount", lowStockCount,
            "expiringSoonCount", expiringSoonCount
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{pharmacyId}/items/{id}")
    @PreAuthorize("hasRole('ADMIN') or @pharmacySecurityService.isPharmacyMember(#pharmacyId, principal)")
    public ResponseEntity<InventoryDto> getInventoryItem(
            @PathVariable Long pharmacyId,
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {

        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + pharmacyId));

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));

        if (!inventory.getPharmacy().getId().equals(pharmacyId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null);
        }

        return ResponseEntity.ok(convertToDto(inventory));
    }

    @PostMapping("/{pharmacyId}/items")
    @PreAuthorize("hasRole('ADMIN') or @pharmacySecurityService.isPharmacyAdmin(#pharmacyId, principal)")
    public ResponseEntity<InventoryDto> createInventoryItem(
            @PathVariable Long pharmacyId,
            @RequestBody InventoryDto inventoryDto,
            @CurrentUser UserPrincipal currentUser) {

        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + pharmacyId));

        Inventory inventory = Inventory.builder()
                .pharmacy(pharmacy)
                .medicationName(inventoryDto.getMedicationName())
                .manufacturer(inventoryDto.getManufacturer())
                .batchNumber(inventoryDto.getBatchNumber())
                .expiryDate(inventoryDto.getExpiryDate())
                .quantity(inventoryDto.getQuantity())
                .minimumStockLevel(inventoryDto.getMinimumStockLevel())
                .costPrice(inventoryDto.getCostPrice())
                .sellingPrice(inventoryDto.getSellingPrice())
                .active(true)
                .medicationType(inventoryDto.getMedicationType())
                .description(inventoryDto.getDescription())
                .dosageForm(inventoryDto.getDosageForm())
                .strength(inventoryDto.getStrength())
                .storageConditions(inventoryDto.getStorageConditions())
                .build();

        Inventory savedInventory = inventoryRepository.save(inventory);
        return ResponseEntity.ok(convertToDto(savedInventory));
    }

    @PutMapping("/{pharmacyId}/items/{id}")
    @PreAuthorize("hasRole('ADMIN') or @pharmacySecurityService.isPharmacyAdmin(#pharmacyId, principal)")
    public ResponseEntity<InventoryDto> updateInventoryItem(
            @PathVariable Long pharmacyId,
            @PathVariable Long id,
            @RequestBody InventoryDto inventoryDto,
            @CurrentUser UserPrincipal currentUser) {

        if (!pharmacyRepository.existsById(pharmacyId)) {
             throw new RuntimeException("Pharmacy not found with id: " + pharmacyId);
        }

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));

        if (!inventory.getPharmacy().getId().equals(pharmacyId)) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        inventory.setMedicationName(inventoryDto.getMedicationName());
        inventory.setManufacturer(inventoryDto.getManufacturer());
        inventory.setBatchNumber(inventoryDto.getBatchNumber());
        inventory.setExpiryDate(inventoryDto.getExpiryDate());
        inventory.setQuantity(inventoryDto.getQuantity());
        inventory.setMinimumStockLevel(inventoryDto.getMinimumStockLevel());
        inventory.setCostPrice(inventoryDto.getCostPrice());
        inventory.setSellingPrice(inventoryDto.getSellingPrice());
        inventory.setActive(inventoryDto.isActive());
        inventory.setMedicationType(inventoryDto.getMedicationType());
        inventory.setDescription(inventoryDto.getDescription());
        inventory.setDosageForm(inventoryDto.getDosageForm());
        inventory.setStrength(inventoryDto.getStrength());
        inventory.setStorageConditions(inventoryDto.getStorageConditions());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        return ResponseEntity.ok(convertToDto(updatedInventory));
    }

    @DeleteMapping("/{pharmacyId}/items/{id}")
     @PreAuthorize("hasRole('ADMIN') or @pharmacySecurityService.isPharmacyAdmin(#pharmacyId, principal)")
    public ResponseEntity<?> deleteInventoryItem(
            @PathVariable Long pharmacyId,
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {

        if (!pharmacyRepository.existsById(pharmacyId)) {
             throw new RuntimeException("Pharmacy not found with id: " + pharmacyId);
        }

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));
        
        if (!inventory.getPharmacy().getId().equals(pharmacyId)) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        inventory.setActive(false);
        inventoryRepository.save(inventory);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/overview")
    @PreAuthorize("hasRole('PHARMACY') or hasRole('ADMIN')")
    public ResponseEntity<?> getInventoryOverview(
            @RequestParam Long pharmacyId,
            @CurrentUser UserPrincipal currentUser) {

        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                 .orElseThrow(() -> new ResourceNotFoundException("Pharmacy", "id", pharmacyId));

        try {
            long totalItems = inventoryRepository.countByPharmacyAndActive(pharmacy, true);
            long lowStockCount = inventoryRepository.countLowStockItems(pharmacy);
            long outOfStockCount = inventoryRepository.countByPharmacyAndQuantityAndActive(pharmacy, 0, true);
            long expiredCount = inventoryRepository.countByPharmacyAndExpiryDateBeforeAndActive(pharmacy, LocalDate.now(), true);
            
            long inStockCount = totalItems - lowStockCount - outOfStockCount - expiredCount;
            inStockCount = Math.max(0, inStockCount);

            List<InventoryOverviewDataPoint> overviewData = List.of(
                new InventoryOverviewDataPoint("In Stock", Long.valueOf(inStockCount)),
                new InventoryOverviewDataPoint("Low Stock", Long.valueOf(lowStockCount)),
                new InventoryOverviewDataPoint("Out of Stock", Long.valueOf(outOfStockCount)),
                new InventoryOverviewDataPoint("Expired", Long.valueOf(expiredCount))
            );

            return ResponseEntity.ok(overviewData);

        } catch (Exception e) {
            logger.error("Error calculating inventory overview for pharmacy {}: {}", pharmacyId, e.getMessage());
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body(new ErrorResponseDto("Failed to calculate inventory overview."));
        }
    }

    private InventoryDto convertToDto(Inventory inventory) {
        return InventoryDto.builder()
                .id(inventory.getId())
                .pharmacyId(inventory.getPharmacy().getId())
                .pharmacyName(inventory.getPharmacy().getName())
                .medicationName(inventory.getMedicationName())
                .manufacturer(inventory.getManufacturer())
                .batchNumber(inventory.getBatchNumber())
                .expiryDate(inventory.getExpiryDate())
                .quantity(inventory.getQuantity())
                .minimumStockLevel(inventory.getMinimumStockLevel())
                .costPrice(inventory.getCostPrice())
                .sellingPrice(inventory.getSellingPrice())
                .active(inventory.isActive())
                .medicationType(inventory.getMedicationType())
                .description(inventory.getDescription())
                .dosageForm(inventory.getDosageForm())
                .strength(inventory.getStrength())
                .storageConditions(inventory.getStorageConditions())
                .lowStock(inventory.isLowStock())
                .expired(inventory.isExpired())
                .expiringWithin30Days(inventory.isExpiringWithin(30))
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }

    // --- Nested DTO for Overview Data (make public static) ---
    @Data 
    @AllArgsConstructor
    public static class InventoryOverviewDataPoint {
        private String name;
        private Long value;
    }
} 
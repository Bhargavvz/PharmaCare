package com.pharmacare.api.dto;

import com.pharmacare.api.model.Bill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDto {
    private Long id;
    private String billNumber;
    private Long pharmacyId;
    private String pharmacyName;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private LocalDateTime billDate;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private Bill.PaymentStatus paymentStatus;
    private Bill.PaymentMethod paymentMethod;
    private Long createdById;
    private String createdByName;
    private List<BillItemDto> items;
    private String prescriptionReference;
    private String notes;
    private String qrCodeData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
package com.pharmacare.api.dto;

import com.pharmacare.api.model.Inventory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDto {
    private Long id;
    private Long pharmacyId;
    private String pharmacyName;
    private String medicationName;
    private String manufacturer;
    private String batchNumber;
    private LocalDate expiryDate;
    private Integer quantity;
    private Integer minimumStockLevel;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private boolean active;
    private Inventory.MedicationType medicationType;
    private String description;
    private String dosageForm;
    private String strength;
    private String storageConditions;
    private boolean lowStock;
    private boolean expired;
    private boolean expiringWithin30Days;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
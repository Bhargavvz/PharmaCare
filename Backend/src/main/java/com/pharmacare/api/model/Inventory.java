package com.pharmacare.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "inventory")
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private Pharmacy pharmacy;
    
    @Column(nullable = false)
    private String medicationName;
    
    @Column(nullable = false)
    private String manufacturer;
    
    @Column(nullable = false)
    private String batchNumber;
    
    @Column(nullable = false)
    private LocalDate expiryDate;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Integer minimumStockLevel;
    
    @Column(nullable = false)
    private BigDecimal costPrice;
    
    @Column(nullable = false)
    private BigDecimal sellingPrice;
    
    @Column(nullable = false)
    private boolean active = true;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicationType medicationType;
    
    private String description;
    
    private String dosageForm;
    
    private String strength;
    
    private String storageConditions;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum MedicationType {
        PRESCRIPTION,
        OVER_THE_COUNTER,
        CONTROLLED_SUBSTANCE,
        DONATED
    }
    
    public boolean isLowStock() {
        return quantity <= minimumStockLevel;
    }
    
    public boolean isExpired() {
        return expiryDate.isBefore(LocalDate.now());
    }
    
    public boolean isExpiringWithin(int days) {
        return expiryDate.isBefore(LocalDate.now().plusDays(days));
    }
} 
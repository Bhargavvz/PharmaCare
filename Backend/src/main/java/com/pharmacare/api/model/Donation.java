package com.pharmacare.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String medicineName;

    @Positive
    private int quantity;

    @NotNull
    private LocalDate expiryDate;

    @NotBlank
    private String location;

    @Enumerated(EnumType.STRING)
    private DonationStatus status = DonationStatus.PENDING;

    private String organization;

    private String notes;

    private LocalDateTime donationDate;

    private LocalDateTime completedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum DonationStatus {
        PENDING,
        ACCEPTED,
        COMPLETED,
        REJECTED
    }
    
    // Helper method to set status from string
    public void setStatus(String statusStr) {
        try {
            this.status = DonationStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            this.status = DonationStatus.PENDING;
        }
    }
    
    // Helper method to get status as string
    public String getStatusString() {
        return this.status.name();
    }
} 
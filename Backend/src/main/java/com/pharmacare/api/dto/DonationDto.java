package com.pharmacare.api.dto;

import com.pharmacare.api.model.Donation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationDto {
    private Long id;
    private String medicineName;
    private int quantity;
    private LocalDate expiryDate;
    private String location;
    private Donation.DonationStatus status;
    private String organization;
    private LocalDateTime createdAt;
} 
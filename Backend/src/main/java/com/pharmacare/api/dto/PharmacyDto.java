package com.pharmacare.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyDto {
    private Long id;

    @NotBlank(message = "Pharmacy name cannot be blank")
    private String name;

    @NotBlank(message = "Registration number cannot be blank")
    private String registrationNumber;

    @NotBlank(message = "Address cannot be blank")
    private String address;

    private String phone;

    @Email(message = "Email should be valid")
    private String email;

    private String website;
    private boolean active;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
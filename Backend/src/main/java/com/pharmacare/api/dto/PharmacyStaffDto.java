package com.pharmacare.api.dto;

import com.pharmacare.api.model.PharmacyStaff;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyStaffDto {
    private Long id;
    private Long pharmacyId;
    private String pharmacyName;
    private Long userId;
    private String userName;
    private String userEmail;
    @NotNull(message = "Staff role cannot be null")
    private PharmacyStaff.StaffRole role;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Include user details for context
    @NotBlank(message = "First name cannot be blank")
    private String firstName;
    @NotBlank(message = "Last name cannot be blank")
    private String lastName;
    @Email(message = "Email should be valid")
    private String email;
} 
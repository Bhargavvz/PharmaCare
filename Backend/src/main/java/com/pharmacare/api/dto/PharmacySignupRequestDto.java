package com.pharmacare.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacySignupRequestDto {

    // Pharmacy Details
    @NotBlank(message = "Pharmacy name is required")
    @Size(min = 2, max = 100, message = "Pharmacy name must be between 2 and 100 characters")
    private String pharmacyName;

    @NotBlank(message = "Registration number is required")
    @Size(min = 2, max = 50, message = "Registration number must be between 2 and 50 characters")
    private String registrationNumber;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 255, message = "Address must be between 5 and 255 characters")
    private String address;

    @Pattern(regexp = "^\\+?[\\d\\s()-]{7,15}$", message = "Phone number is invalid", flags = Pattern.Flag.CASE_INSENSITIVE)
    private String phone;

    @Email(message = "Pharmacy email should be valid")
    private String pharmacyEmail;

    private String website;

    // Initial Admin Staff Details
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String adminFirstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String adminLastName;

    @NotBlank(message = "Admin email is required")
    @Email(message = "Admin email should be valid")
    private String adminEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String adminPassword;
} 
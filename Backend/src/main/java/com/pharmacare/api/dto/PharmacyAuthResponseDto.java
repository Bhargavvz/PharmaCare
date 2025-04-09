package com.pharmacare.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyAuthResponseDto {
    private String token;
    private PharmacyStaffDto pharmacyStaff;
} 
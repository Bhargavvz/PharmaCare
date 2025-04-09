package com.pharmacare.api.dto;

import com.pharmacare.api.model.FamilyMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberDto {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String imageUrl;
    private String relationship;
    private boolean canViewMedications;
    private boolean canEditMedications;
    private boolean canManageReminders;
    private String status;
}
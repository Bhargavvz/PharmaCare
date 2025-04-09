package com.pharmacare.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderDto {
    private Long id;
    private Long medicationId;
    private String medicationName;
    private String medicationDosage;
    private LocalDateTime reminderTime;
    private String notes;
    private boolean completed;
    private LocalDateTime completedAt;
} 
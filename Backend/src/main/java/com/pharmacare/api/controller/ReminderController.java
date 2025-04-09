package com.pharmacare.api.controller;

import com.pharmacare.api.dto.ErrorResponseDto;
import com.pharmacare.api.exception.ResourceNotFoundException;
import com.pharmacare.api.model.Medication;
import com.pharmacare.api.model.Reminder;
import com.pharmacare.api.model.User;
import com.pharmacare.api.repository.MedicationRepository;
import com.pharmacare.api.repository.ReminderRepository;
import com.pharmacare.api.repository.UserRepository;
import com.pharmacare.api.security.oauth2.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private static final Logger logger = LoggerFactory.getLogger(ReminderController.class);
    private final ReminderRepository reminderRepository;
    private final MedicationRepository medicationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllReminders() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
            
            List<Reminder> reminders = reminderRepository.findByMedicationUserId(user.getId());
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            logger.error("Error retrieving reminders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error retrieving reminders: " + e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingReminders(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
            
            List<Reminder> reminders;
            if (start != null && end != null) {
                LocalDateTime startDate = LocalDateTime.parse(start);
                LocalDateTime endDate = LocalDateTime.parse(end);
                reminders = reminderRepository.findByMedicationUserIdAndCompletedFalseAndReminderTimeBetween(
                        user.getId(), startDate, endDate);
            } else {
                reminders = reminderRepository.findByMedicationUserIdAndCompletedFalse(user.getId());
            }
            
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            logger.error("Error retrieving pending reminders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error retrieving pending reminders: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createReminder(@Valid @RequestBody Reminder reminder) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
            
            Medication medication = medicationRepository.findByIdAndUserId(reminder.getMedicationId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medication", "id", reminder.getMedicationId()));
            
            reminder.setMedication(medication);
            reminder.setCompleted(false);
            
            Reminder savedReminder = reminderRepository.save(reminder);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReminder);
        } catch (ResourceNotFoundException e) {
            logger.error("Medication not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponseDto(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating reminder", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error creating reminder: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReminderById(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
            
            Reminder reminder = reminderRepository.findByIdAndMedicationUserId(id, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));
            
            return ResponseEntity.ok(reminder);
        } catch (ResourceNotFoundException e) {
            logger.error("Reminder not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponseDto(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error retrieving reminder", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error retrieving reminder: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @Valid @RequestBody Reminder reminderDetails) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
            
            Reminder reminder = reminderRepository.findByIdAndMedicationUserId(id, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));
            
            if (reminderDetails.getMedicationId() != null && 
                !reminderDetails.getMedicationId().equals(reminder.getMedication().getId())) {
                Medication medication = medicationRepository.findByIdAndUserId(reminderDetails.getMedicationId(), user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Medication", "id", reminderDetails.getMedicationId()));
                reminder.setMedication(medication);
            }
            
            reminder.setReminderTime(reminderDetails.getReminderTime());
            reminder.setNotes(reminderDetails.getNotes());
            reminder.setCompleted(reminderDetails.isCompleted());
            if (reminderDetails.isCompleted() && reminder.getCompletedAt() == null) {
                reminder.setCompletedAt(LocalDateTime.now());
            } else if (!reminderDetails.isCompleted()) {
                reminder.setCompletedAt(null);
            }
            
            Reminder updatedReminder = reminderRepository.save(reminder);
            return ResponseEntity.ok(updatedReminder);
        } catch (ResourceNotFoundException e) {
            logger.error("Reminder or medication not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponseDto(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating reminder", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error updating reminder: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
            
            Reminder reminder = reminderRepository.findByIdAndMedicationUserId(id, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));
            
            reminderRepository.delete(reminder);
            
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            logger.error("Reminder not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponseDto(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting reminder", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error deleting reminder: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeReminder(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
            
            Reminder reminder = reminderRepository.findByIdAndMedicationUserId(id, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));
            
            reminder.setCompleted(true);
            reminder.setCompletedAt(LocalDateTime.now());
            
            Reminder completedReminder = reminderRepository.save(reminder);
            return ResponseEntity.ok(completedReminder);
        } catch (ResourceNotFoundException e) {
            logger.error("Reminder not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponseDto(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error completing reminder", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error completing reminder: " + e.getMessage()));
        }
    }
} 
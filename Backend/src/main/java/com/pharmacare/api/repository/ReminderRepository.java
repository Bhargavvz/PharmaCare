package com.pharmacare.api.repository;

import com.pharmacare.api.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByMedicationUserId(Long userId);
    List<Reminder> findByMedicationUserIdAndCompletedFalse(Long userId);
    List<Reminder> findByMedicationUserIdAndCompletedFalseAndReminderTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);
    Optional<Reminder> findByIdAndMedicationUserId(Long id, Long userId);
    
    long countByMedicationUserIdAndCompletedFalse(Long userId);
    long countByMedicationUserIdAndCompletedTrueAndReminderTimeAfter(Long userId, LocalDateTime after);
    long countByMedicationUserIdAndReminderTimeAfter(Long userId, LocalDateTime after);
} 
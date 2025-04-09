package com.pharmacare.api.repository;

import com.pharmacare.api.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByUserId(Long userId);
    List<Medication> findByUserIdAndActiveTrue(Long userId);
    Optional<Medication> findByIdAndUserId(Long id, Long userId);
    
    long countByUserIdAndActiveTrue(Long userId);
    long countByUserIdAndActiveFalse(Long userId);
} 
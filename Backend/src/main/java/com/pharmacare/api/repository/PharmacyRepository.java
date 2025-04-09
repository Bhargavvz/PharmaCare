package com.pharmacare.api.repository;

import com.pharmacare.api.model.Pharmacy;
import com.pharmacare.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {
    
    List<Pharmacy> findByOwner(User owner);
    
    Optional<Pharmacy> findByRegistrationNumber(String registrationNumber);
    
    List<Pharmacy> findByActive(boolean active);
    
    boolean existsByRegistrationNumber(String registrationNumber);
} 
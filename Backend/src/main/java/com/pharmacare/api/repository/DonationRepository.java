package com.pharmacare.api.repository;

import com.pharmacare.api.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserId(Long userId);
    List<Donation> findByUserIdAndStatus(Long userId, String status);
    Optional<Donation> findByIdAndUserId(Long id, Long userId);
} 
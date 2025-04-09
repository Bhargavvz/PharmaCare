package com.pharmacare.api.repository;

import com.pharmacare.api.model.Pharmacy;
import com.pharmacare.api.model.PharmacyStaff;
import com.pharmacare.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyStaffRepository extends JpaRepository<PharmacyStaff, Long> {
    
    List<PharmacyStaff> findByPharmacy(Pharmacy pharmacy);
    
    List<PharmacyStaff> findByUser(User user);
    
    Optional<PharmacyStaff> findByPharmacyAndUser(Pharmacy pharmacy, User user);
    
    List<PharmacyStaff> findByPharmacyAndRole(Pharmacy pharmacy, PharmacyStaff.StaffRole role);
    
    List<PharmacyStaff> findByPharmacyAndActive(Pharmacy pharmacy, boolean active);
    
    boolean existsByPharmacyAndUser(Pharmacy pharmacy, User user);

    List<PharmacyStaff> findByPharmacyId(Long pharmacyId);
    
    List<PharmacyStaff> findByUserId(Long userId);
} 
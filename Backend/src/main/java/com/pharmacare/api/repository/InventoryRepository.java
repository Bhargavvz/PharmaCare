package com.pharmacare.api.repository;

import com.pharmacare.api.model.Inventory;
import com.pharmacare.api.model.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    List<Inventory> findByPharmacy(Pharmacy pharmacy);
    
    List<Inventory> findByPharmacyAndActive(Pharmacy pharmacy, boolean active);
    
    long countByPharmacyAndActive(Pharmacy pharmacy, boolean active);
    
    long countByPharmacyAndQuantityAndActive(Pharmacy pharmacy, Integer quantity, boolean active);
    
    List<Inventory> findByPharmacyAndMedicationNameContainingIgnoreCase(Pharmacy pharmacy, String medicationName);
    
    List<Inventory> findByPharmacyAndMedicationType(Pharmacy pharmacy, Inventory.MedicationType medicationType);
    
    @Query("SELECT i FROM Inventory i WHERE i.pharmacy = :pharmacy AND i.quantity <= i.minimumStockLevel")
    List<Inventory> findLowStockItems(@Param("pharmacy") Pharmacy pharmacy);
    
    @Query("SELECT count(i) FROM Inventory i WHERE i.pharmacy = :pharmacy AND i.quantity <= i.minimumStockLevel")
    long countLowStockItems(@Param("pharmacy") Pharmacy pharmacy);
    
    @Query("SELECT i FROM Inventory i WHERE i.pharmacy = :pharmacy AND i.expiryDate <= :date")
    List<Inventory> findExpiringItems(@Param("pharmacy") Pharmacy pharmacy, @Param("date") LocalDate date);
    
    @Query("SELECT i FROM Inventory i WHERE i.pharmacy = :pharmacy AND i.expiryDate BETWEEN :startDate AND :endDate")
    List<Inventory> findExpiringBetween(@Param("pharmacy") Pharmacy pharmacy, 
                                       @Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
                                       
    @Query("SELECT count(i) FROM Inventory i WHERE i.pharmacy = :pharmacy AND i.expiryDate BETWEEN :startDate AND :endDate")
    long countExpiringBetween(@Param("pharmacy") Pharmacy pharmacy, 
                               @Param("startDate") LocalDate startDate, 
                               @Param("endDate") LocalDate endDate);
                               
    long countByPharmacyAndExpiryDateBeforeAndActive(Pharmacy pharmacy, LocalDate date, boolean active);
} 
package com.pharmacare.api.repository;

import com.pharmacare.api.model.Bill;
import com.pharmacare.api.model.Pharmacy;
import com.pharmacare.api.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    List<Bill> findByPharmacy(Pharmacy pharmacy);
    
    List<Bill> findByPharmacyOrderByCreatedAtDesc(Pharmacy pharmacy, Pageable pageable);
    
    List<Bill> findByPharmacyAndPaymentStatus(Pharmacy pharmacy, Bill.PaymentStatus paymentStatus);
    
    List<Bill> findByCustomer(User customer);
    
    Optional<Bill> findByBillNumber(String billNumber);
    
    @Query("SELECT b FROM Bill b WHERE b.pharmacy = :pharmacy AND b.billDate BETWEEN :startDate AND :endDate")
    List<Bill> findByPharmacyAndDateRange(@Param("pharmacy") Pharmacy pharmacy, 
                                         @Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(b.totalAmount) FROM Bill b WHERE b.pharmacy = :pharmacy AND b.paymentStatus = 'PAID' AND b.billDate BETWEEN :startDate AND :endDate")
    Double getTotalSalesForPeriod(@Param("pharmacy") Pharmacy pharmacy, 
                                 @Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);
} 
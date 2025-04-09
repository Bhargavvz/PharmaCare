package com.pharmacare.api.repository;

import com.pharmacare.api.model.Bill;
import com.pharmacare.api.model.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> {
    List<BillItem> findByBill(Bill bill);
    // Add other specific query methods if needed later
} 
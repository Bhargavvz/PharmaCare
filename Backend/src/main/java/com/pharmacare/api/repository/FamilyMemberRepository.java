package com.pharmacare.api.repository;

import com.pharmacare.api.model.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    List<FamilyMember> findByUserId(Long userId);
    Optional<FamilyMember> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
} 
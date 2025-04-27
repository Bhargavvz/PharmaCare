package com.pharmacare.api.repository;

import com.pharmacare.api.model.MedicalDocument;
import com.pharmacare.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Long> {
    List<MedicalDocument> findByUser(User user);
    List<MedicalDocument> findByUserAndDocumentType(User user, String documentType);
} 
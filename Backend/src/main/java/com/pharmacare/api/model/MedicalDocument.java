package com.pharmacare.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "medical_documents")
public class MedicalDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String documentType; // e.g., PRESCRIPTION, LAB_REPORT, XRAY, etc.

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType; // e.g., PDF, JPG, PNG

    @Lob
    @Column(nullable = false)
    private byte[] fileData;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    @Column(nullable = false)
    private LocalDateTime lastModifiedDate;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
        lastModifiedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDateTime.now();
    }
} 
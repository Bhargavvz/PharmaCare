package com.pharmacare.api.service;

import com.pharmacare.api.model.MedicalDocument;
import com.pharmacare.api.model.User;
import com.pharmacare.api.repository.MedicalDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class MedicalDocumentService {

    @Autowired
    private MedicalDocumentRepository medicalDocumentRepository;

    public MedicalDocument uploadDocument(User user, MultipartFile file, String documentType, String description) throws IOException {
        MedicalDocument document = new MedicalDocument();
        document.setUser(user);
        document.setDocumentType(documentType);
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setFileData(file.getBytes());
        document.setDescription(description);
        
        return medicalDocumentRepository.save(document);
    }

    public List<MedicalDocument> getUserDocuments(User user) {
        return medicalDocumentRepository.findByUser(user);
    }

    public List<MedicalDocument> getUserDocumentsByType(User user, String documentType) {
        return medicalDocumentRepository.findByUserAndDocumentType(user, documentType);
    }

    public MedicalDocument getDocument(Long id) {
        return medicalDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public void deleteDocument(Long id) {
        medicalDocumentRepository.deleteById(id);
    }
} 
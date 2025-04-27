package com.pharmacare.api.controller;

import com.pharmacare.api.model.MedicalDocument;
import com.pharmacare.api.model.User;
import com.pharmacare.api.service.MedicalDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/medical-documents")
public class MedicalDocumentController {

    @Autowired
    private MedicalDocumentService medicalDocumentService;

    @PostMapping("/upload")
    public ResponseEntity<MedicalDocument> uploadDocument(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "description", required = false) String description) {
        try {
            MedicalDocument document = medicalDocumentService.uploadDocument(user, file, documentType, description);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<MedicalDocument>> getUserDocuments(@AuthenticationPrincipal User user) {
        List<MedicalDocument> documents = medicalDocumentService.getUserDocuments(user);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/type/{documentType}")
    public ResponseEntity<List<MedicalDocument>> getUserDocumentsByType(
            @AuthenticationPrincipal User user,
            @PathVariable String documentType) {
        List<MedicalDocument> documents = medicalDocumentService.getUserDocumentsByType(user, documentType);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getDocument(@PathVariable Long id) {
        MedicalDocument document = medicalDocumentService.getDocument(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(document.getFileType()));
        headers.setContentDispositionFormData("attachment", document.getFileName());
        return new ResponseEntity<>(document.getFileData(), headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        medicalDocumentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }
} 
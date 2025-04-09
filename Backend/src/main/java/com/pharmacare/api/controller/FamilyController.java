package com.pharmacare.api.controller;

import com.pharmacare.api.dto.ErrorResponseDto;
import com.pharmacare.api.model.FamilyMember;
import com.pharmacare.api.model.User;
import com.pharmacare.api.repository.FamilyMemberRepository;
import com.pharmacare.api.repository.UserRepository;
import com.pharmacare.api.security.CurrentUser;
import com.pharmacare.api.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
@Slf4j
public class FamilyController {

    private final FamilyMemberRepository familyMemberRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllFamilyMembers(@CurrentUser UserPrincipal currentUser) {
        try {
            Optional<User> userOptional = userRepository.findById(currentUser.getId());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponseDto("User not found"));
            }

            List<FamilyMember> familyMembers = familyMemberRepository.findByUserId(currentUser.getId());
            return ResponseEntity.ok(familyMembers);
        } catch (Exception e) {
            log.error("Error retrieving family members", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error retrieving family members"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFamilyMemberById(@PathVariable Long id, @CurrentUser UserPrincipal currentUser) {
        try {
            Optional<FamilyMember> familyMemberOptional = familyMemberRepository.findById(id);
            if (familyMemberOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponseDto("Family member not found"));
            }

            FamilyMember familyMember = familyMemberOptional.get();
            if (!familyMember.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponseDto("You don't have permission to access this family member"));
            }

            return ResponseEntity.ok(familyMember);
        } catch (Exception e) {
            log.error("Error retrieving family member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error retrieving family member"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createFamilyMember(@Valid @RequestBody FamilyMember familyMember, @CurrentUser UserPrincipal currentUser) {
        try {
            Optional<User> userOptional = userRepository.findById(currentUser.getId());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponseDto("User not found"));
            }

            User user = userOptional.get();
            familyMember.setUser(user);
            familyMember.setStatus("Active");

            FamilyMember savedFamilyMember = familyMemberRepository.save(familyMember);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFamilyMember);
        } catch (Exception e) {
            log.error("Error creating family member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error creating family member"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFamilyMember(@PathVariable Long id, @Valid @RequestBody FamilyMember familyMemberRequest, @CurrentUser UserPrincipal currentUser) {
        try {
            Optional<FamilyMember> familyMemberOptional = familyMemberRepository.findById(id);
            if (familyMemberOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponseDto("Family member not found"));
            }

            FamilyMember existingFamilyMember = familyMemberOptional.get();
            if (!existingFamilyMember.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponseDto("You don't have permission to update this family member"));
            }

            existingFamilyMember.setName(familyMemberRequest.getName());
            existingFamilyMember.setRelationship(familyMemberRequest.getRelationship());
            existingFamilyMember.setAge(familyMemberRequest.getAge());
            existingFamilyMember.setCanViewMedications(familyMemberRequest.isCanViewMedications());
            existingFamilyMember.setCanEditMedications(familyMemberRequest.isCanEditMedications());
            existingFamilyMember.setCanManageReminders(familyMemberRequest.isCanManageReminders());

            FamilyMember updatedFamilyMember = familyMemberRepository.save(existingFamilyMember);
            return ResponseEntity.ok(updatedFamilyMember);
        } catch (Exception e) {
            log.error("Error updating family member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error updating family member"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFamilyMember(@PathVariable Long id, @CurrentUser UserPrincipal currentUser) {
        try {
            Optional<FamilyMember> familyMemberOptional = familyMemberRepository.findById(id);
            if (familyMemberOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponseDto("Family member not found"));
            }

            FamilyMember familyMember = familyMemberOptional.get();
            if (!familyMember.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponseDto("You don't have permission to delete this family member"));
            }

            familyMemberRepository.delete(familyMember);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting family member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Error deleting family member"));
        }
    }
} 
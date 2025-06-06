package com.pharmacare.api.controller;

import com.pharmacare.api.dto.AuthResponseDto;
import com.pharmacare.api.dto.ErrorResponseDto;
import com.pharmacare.api.dto.LoginRequestDto;
import com.pharmacare.api.dto.PharmacyAuthResponseDto;
import com.pharmacare.api.dto.PharmacySignupRequestDto;
import com.pharmacare.api.dto.PharmacyStaffDto;
import com.pharmacare.api.dto.SignupRequestDto;
import com.pharmacare.api.dto.UserDto;
import com.pharmacare.api.dto.ValidatedUserDto;
import com.pharmacare.api.model.ERole;
import com.pharmacare.api.model.Pharmacy;
import com.pharmacare.api.model.PharmacyStaff;
import com.pharmacare.api.model.Role;
import com.pharmacare.api.model.User;
import com.pharmacare.api.repository.PharmacyRepository;
import com.pharmacare.api.repository.PharmacyStaffRepository;
import com.pharmacare.api.repository.RoleRepository;
import com.pharmacare.api.repository.UserRepository;
import com.pharmacare.api.security.JwtTokenProvider;
import com.pharmacare.api.security.oauth2.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final PharmacyRepository pharmacyRepository;
    private final PharmacyStaffRepository pharmacyStaffRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // --- Add Role Check ---
            boolean isRegularUser = userPrincipal.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(ERole.ROLE_USER.name()));
            boolean isPharmacyStaff = userPrincipal.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(ERole.ROLE_PHARMACY.name()));

            if (!isRegularUser || isPharmacyStaff) { // Must be USER and explicitly NOT PHARMACY
                logger.warn("Login attempt failed for user {} via /auth/login: Incorrect role.", loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseDto("Unauthorized: Access denied for this user type."));
            }
            // --- End Role Check ---

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            UserDto userDto = mapToUserDto(userRepository.findById(userPrincipal.getId()).orElseThrow());

            return ResponseEntity.ok(new AuthResponseDto(jwt, userDto));
        } catch (Exception e) {
            logger.error("Login error", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDto("Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequestDto signupRequest) {
        try {
            logger.info("Registering user with email: {}", signupRequest.getEmail());
            
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponseDto("Email is already in use!"));
            }

            // Create new user's account
            User user = new User(
                    signupRequest.getFirstName(),
                    signupRequest.getLastName(),
                    signupRequest.getEmail(),
                    passwordEncoder.encode(signupRequest.getPassword())
            );

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            user.setRoles(roles);
            user.setEnabled(true);

            User savedUser = userRepository.save(user);
            logger.info("User registered successfully with ID: {}", savedUser.getId());

            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/users/{id}")
                    .buildAndExpand(savedUser.getId()).toUri();

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            signupRequest.getEmail(),
                            signupRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            UserDto userDto = mapToUserDto(savedUser);

            return ResponseEntity.created(location).body(new AuthResponseDto(jwt, userDto));
        } catch (Exception e) {
            logger.error("Registration error", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponseDto("Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/pharmacy/signup")
    public ResponseEntity<?> registerPharmacy(@Valid @RequestBody PharmacySignupRequestDto signupRequest) {
        logger.info("Attempting to register pharmacy with name: {}, registration: {}, and admin email: {}", 
            signupRequest.getPharmacyName(), signupRequest.getRegistrationNumber(), signupRequest.getAdminEmail());

        try {
            // Validate admin email
            if (userRepository.existsByEmail(signupRequest.getAdminEmail())) {
                logger.warn("Admin email is already in use: {}", signupRequest.getAdminEmail());
                return ResponseEntity.badRequest().body(new ErrorResponseDto("Admin email is already in use!"));
            }
            
            // Validate pharmacy registration number
            if (pharmacyRepository.existsByRegistrationNumber(signupRequest.getRegistrationNumber())) {
                logger.warn("Pharmacy registration number already exists: {}", signupRequest.getRegistrationNumber());
                return ResponseEntity.badRequest().body(new ErrorResponseDto("Pharmacy registration number already exists!"));
            }
            
            // Optional pharmacy email validation if provided
            if (signupRequest.getPharmacyEmail() != null && !signupRequest.getPharmacyEmail().isEmpty() && 
                userRepository.existsByEmail(signupRequest.getPharmacyEmail())) {
                logger.warn("Pharmacy email is already in use: {}", signupRequest.getPharmacyEmail());
                return ResponseEntity.badRequest().body(new ErrorResponseDto("Pharmacy email is already in use!"));
            }

            // Create User for the admin staff
            User adminUser = new User(
                    signupRequest.getAdminFirstName(),
                    signupRequest.getAdminLastName(),
                    signupRequest.getAdminEmail(),
                    passwordEncoder.encode(signupRequest.getAdminPassword())
            );
            adminUser.setEnabled(true); // Assuming pharmacy admin is enabled immediately
            
            Set<Role> roles = new HashSet<>();
            Role pharmacyRole = roleRepository.findByName(ERole.ROLE_PHARMACY)
                    .orElseThrow(() -> new RuntimeException("Error: ROLE_PHARMACY is not found."));
            roles.add(pharmacyRole);
            adminUser.setRoles(roles);
            
            logger.info("Saving pharmacy admin user: {}", adminUser.getEmail());
            User savedAdminUser = userRepository.save(adminUser);
            logger.info("Pharmacy Admin User registered successfully with ID: {}", savedAdminUser.getId());

            // Create Pharmacy
            Pharmacy pharmacy = Pharmacy.builder()
                    .name(signupRequest.getPharmacyName())
                    .registrationNumber(signupRequest.getRegistrationNumber())
                    .address(signupRequest.getAddress())
                    .phone(signupRequest.getPhone())
                    .email(signupRequest.getPharmacyEmail())
                    .website(signupRequest.getWebsite())
                    .owner(savedAdminUser)
                    .active(true)
                    .build();
                    
            logger.info("Saving pharmacy: {}", pharmacy.getName());
            Pharmacy savedPharmacy = pharmacyRepository.save(pharmacy);
            logger.info("Pharmacy registered successfully with ID: {}", savedPharmacy.getId());

            // Create PharmacyStaff entry for the admin
            PharmacyStaff adminStaff = PharmacyStaff.builder()
                    .pharmacy(savedPharmacy)
                    .user(savedAdminUser)
                    .role(PharmacyStaff.StaffRole.ADMIN)
                    .active(true)
                    .build();
                    
            logger.info("Saving pharmacy staff: {} {}", adminStaff.getUser().getFirstName(), adminStaff.getUser().getLastName());
            PharmacyStaff savedAdminStaff = pharmacyStaffRepository.save(adminStaff);
            logger.info("Pharmacy Admin Staff created successfully with ID: {}", savedAdminStaff.getId());

            // Authenticate and return token immediately
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                signupRequest.getAdminEmail(),
                                signupRequest.getAdminPassword()
                        )
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = tokenProvider.generateToken(authentication);

                PharmacyStaffDto staffDto = mapToPharmacyStaffDto(savedAdminStaff);
                
                return ResponseEntity.ok(new PharmacyAuthResponseDto(jwt, staffDto));
            } catch (Exception authEx) {
                logger.error("Authentication after pharmacy registration failed", authEx);
                // Still return success, but client will need to login separately
                return ResponseEntity.ok(new ErrorResponseDto(HttpStatus.OK.value(), 
                    "Pharmacy registration successful, but auto-login failed. Please login separately."));
            }

        } catch (Exception e) {
            logger.error("Pharmacy registration error", e);
            
            // If exception occurred after admin user created but before completion, clean up
            if (userRepository.existsByEmail(signupRequest.getAdminEmail())) {
                try {
                    Optional<User> user = userRepository.findByEmail(signupRequest.getAdminEmail());
                    if (user.isPresent()) {
                        logger.info("Cleaning up partial registration - deleting user with ID: {}", user.get().getId());
                        userRepository.delete(user.get());
                    }
                } catch (Exception cleanupEx) {
                    logger.error("Failed to clean up partial registration", cleanupEx);
                }
            }
            
            // Return proper error message
            String errorMessage = e.getMessage();
            if (errorMessage == null || errorMessage.isEmpty()) {
                errorMessage = "Pharmacy registration failed. Please try again.";
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto(errorMessage));
        }
    }

    @PostMapping("/pharmacy/login")
    public ResponseEntity<?> authenticatePharmacyStaff(@Valid @RequestBody LoginRequestDto loginRequest) {
        logger.info("Attempting pharmacy staff login for email: {}", loginRequest.getEmail());
        try {
            // Check if the user exists first
            if (!userRepository.existsByEmail(loginRequest.getEmail())) {
                logger.warn("Pharmacy login attempt failed: Email {} not found", loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseDto("Authentication failed: Invalid email or password"));
            }
            
            // Try to authenticate
            Authentication authentication;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(),
                                loginRequest.getPassword()
                        )
                );
            } catch (Exception e) {
                logger.warn("Pharmacy login authentication failed for email {}: {}", loginRequest.getEmail(), e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseDto("Authentication failed: Invalid email or password"));
            }

            // Set security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate token
            String jwt = tokenProvider.generateToken(authentication);

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // Verify user has ROLE_PHARMACY
            boolean isPharmacyStaff = userPrincipal.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(ERole.ROLE_PHARMACY.name()));
                
            if (!isPharmacyStaff) {
                logger.warn("User {} attempted to login to pharmacy portal but doesn't have ROLE_PHARMACY", loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDto("Unauthorized: User is not pharmacy staff."));
            }

            // Find associated PharmacyStaff details
            List<PharmacyStaff> staffAssignments = pharmacyStaffRepository.findByUserId(userPrincipal.getId());
            if (staffAssignments.isEmpty()) {
                logger.error("User {} has ROLE_PHARMACY but no PharmacyStaff records found", loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Authentication failed: Staff record not found. Please contact support."));
            }
            
            // Get the active staff assignment
            PharmacyStaff staff = staffAssignments.stream()
                .filter(PharmacyStaff::isActive)
                .findFirst()
                .orElse(staffAssignments.get(0));
            
            // Check if staff is active
            if (!staff.isActive()) {
                logger.warn("User {} attempted to login but their staff account is inactive", loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponseDto("Your staff account is currently inactive. Please contact your pharmacy administrator."));
            }

            PharmacyStaffDto staffDto = mapToPharmacyStaffDto(staff);
            logger.info("Pharmacy staff login successful for: {} {}, pharmacy: {}", 
                    staffDto.getFirstName(), staffDto.getLastName(), staffDto.getPharmacyName());

            return ResponseEntity.ok(new PharmacyAuthResponseDto(jwt, staffDto));
        } catch (Exception e) {
            logger.error("Pharmacy staff login error", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDto("Authentication failed: " + e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        try {
            logger.debug("Token validation request received.");
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof UserPrincipal)) {
                 logger.warn("Validation failed: No valid authentication found in context.");
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                         .body(new ErrorResponseDto("Token validation failed: Invalid authentication context."));
            }
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            logger.debug("Validating token for user ID: {}", userPrincipal.getId());
            
            // Fetch the full User entity to get roles reliably
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found during validation for ID: " + userPrincipal.getId()));
            
            // Check roles from the User entity
            boolean isPharmacy = user.getRoles().stream()
                                   .anyMatch(role -> role.getName() == ERole.ROLE_PHARMACY);
            boolean isUser = user.getRoles().stream()
                                   .anyMatch(role -> role.getName() == ERole.ROLE_USER);

            if (isPharmacy) {
                logger.debug("User ID {} has ROLE_PHARMACY. Fetching staff details.", user.getId());
                List<PharmacyStaff> staffAssignments = pharmacyStaffRepository.findByUserId(user.getId());
                if (staffAssignments.isEmpty()) {
                    logger.error("Inconsistency: User ID {} has ROLE_PHARMACY but no PharmacyStaff assignment found.", user.getId());
                    // Return error - shouldn't happen if signup is correct
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new ErrorResponseDto("User role inconsistency detected."));
                }
                PharmacyStaff staff = staffAssignments.get(0); // Assuming first is primary
                PharmacyStaffDto staffDto = mapToPharmacyStaffDto(staff);
                logger.debug("Returning PharmacyStaff details for user ID: {}", user.getId());
                return ResponseEntity.ok(new ValidatedUserDto("pharmacy", staffDto));
                 
            } else if (isUser) {
                logger.debug("User ID {} has ROLE_USER. Returning user details.", user.getId());
                UserDto userDto = mapToUserDto(user);
                return ResponseEntity.ok(new ValidatedUserDto("user", userDto));
            } else {
                 // Handle cases with other roles (e.g., ADMIN) or no expected roles
                 logger.warn("User ID {} has unrecognized role combination during validation.", user.getId());
                 // For now, treat as unauthorized for standard flows
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                         .body(new ErrorResponseDto("Token validation failed: User role not supported for this context."));
            }

        } catch (Exception e) {
            logger.error("Token validation error", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDto("Token validation failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/google-login-url")
    public ResponseEntity<?> getGoogleLoginUrl() {
        try {
            // This is a placeholder. In a real implementation, you would generate the OAuth URL
            String googleLoginUrl = "/oauth2/authorization/google";
            return ResponseEntity.ok(new GoogleLoginUrlResponse(googleLoginUrl));
        } catch (Exception e) {
            logger.error("Google login URL error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("Failed to get Google login URL: " + e.getMessage()));
        }
    }
    
    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    private PharmacyStaffDto mapToPharmacyStaffDto(PharmacyStaff staff) {
        User user = staff.getUser();
        Pharmacy pharmacy = staff.getPharmacy();
        
        if (user == null) {
            logger.error("Cannot map PharmacyStaff to DTO: user is null for staff ID {}", staff.getId());
            throw new IllegalStateException("PharmacyStaff entity has null User reference");
        }
        
        if (pharmacy == null) {
            logger.error("Cannot map PharmacyStaff to DTO: pharmacy is null for staff ID {}", staff.getId());
            throw new IllegalStateException("PharmacyStaff entity has null Pharmacy reference");
        }
        
        return PharmacyStaffDto.builder()
                .id(staff.getId())
                .pharmacyId(pharmacy.getId())
                .pharmacyName(pharmacy.getName())
                .userId(user.getId())
                .userName(user.getFirstName() + " " + user.getLastName())
                .userEmail(user.getEmail())
                .role(staff.getRole())
                .active(staff.isActive())
                .createdAt(staff.getCreatedAt())
                .updatedAt(staff.getUpdatedAt())
                // User details
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }
    
    private static class GoogleLoginUrlResponse {
        private final String url;
        
        public GoogleLoginUrlResponse(String url) {
            this.url = url;
        }
        
        public String getUrl() {
            return url;
        }
    }
} 
package com.pharmacare.api.dto;

import com.pharmacare.api.model.Bill;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBillRequestDto {

    @NotNull(message = "Pharmacy ID cannot be null")
    private Long pharmacyId;

    // Customer details (optional user ID, required name if no ID)
    private Long customerId; // Optional: Link to existing user

    @Size(max = 100, message = "Customer name cannot exceed 100 characters")
    private String customerName; // Required if customerId is null

    @Size(max = 20, message = "Customer phone cannot exceed 20 characters")
    private String customerPhone;

    @Email(message = "Customer email should be valid")
    @Size(max = 100, message = "Customer email cannot exceed 100 characters")
    private String customerEmail;

    @NotNull(message = "Payment method cannot be null")
    private Bill.PaymentMethod paymentMethod;

    @NotNull(message = "Payment status cannot be null")
    private Bill.PaymentStatus paymentStatus = Bill.PaymentStatus.PAID; // Default to PAID

    @NotEmpty(message = "Bill must contain at least one item")
    @Valid // Enable validation of items in the list
    private List<CreateBillItemDto> items;

    // Optional financial details (can be calculated backend too)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal taxAmount = BigDecimal.ZERO; // Could be calculated based on items/rules

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    @Size(max = 100, message = "Prescription reference cannot exceed 100 characters")
    private String prescriptionReference;

    // Ensure either customerId or customerName is provided
    // Custom validation could be added here using @AssertTrue or a custom validator
    public boolean isCustomerInfoValid() {
        return customerId != null || (customerName != null && !customerName.isBlank());
    }
} 
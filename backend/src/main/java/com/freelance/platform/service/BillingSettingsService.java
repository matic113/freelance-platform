package com.freelance.platform.service;

import com.freelance.platform.dto.request.AddPaymentMethodRequest;
import com.freelance.platform.dto.request.UpdateBillingSettingsRequest;
import com.freelance.platform.dto.response.BillingSettingsResponse;
import com.freelance.platform.dto.response.PaymentMethodResponse;
import com.freelance.platform.entity.BillingSettings;
import com.freelance.platform.entity.PaymentMethod;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.BillingSettingsRepository;
import com.freelance.platform.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BillingSettingsService {
    
    @Autowired
    private BillingSettingsRepository billingSettingsRepository;
    
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EncryptionService encryptionService;
    
    // Billing Settings Methods
    public BillingSettingsResponse getBillingSettings(UUID userId) {
        User user = userService.findById(userId);
        BillingSettings settings = billingSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultBillingSettings(user));
        
        return new BillingSettingsResponse(settings);
    }
    
    public BillingSettingsResponse updateBillingSettings(UUID userId, UpdateBillingSettingsRequest request) {
        User user = userService.findById(userId);
        BillingSettings settings = billingSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultBillingSettings(user));
        
        // Update billing information
        if (request.getStreetAddress() != null) {
            settings.setStreetAddress(request.getStreetAddress());
        }
        if (request.getCity() != null) {
            settings.setCity(request.getCity());
        }
        if (request.getStateProvince() != null) {
            settings.setStateProvince(request.getStateProvince());
        }
        if (request.getZipCode() != null) {
            settings.setZipCode(request.getZipCode());
        }
        if (request.getCountry() != null) {
            settings.setCountry(request.getCountry());
        }
        if (request.getAutoRenewal() != null) {
            settings.setAutoRenewal(request.getAutoRenewal());
        }
        if (request.getBillingEmail() != null) {
            settings.setBillingEmail(request.getBillingEmail());
        }
        if (request.getTaxId() != null) {
            settings.setTaxId(request.getTaxId());
        }
        if (request.getCompanyName() != null) {
            settings.setCompanyName(request.getCompanyName());
        }
        
        BillingSettings savedSettings = billingSettingsRepository.save(settings);
        return new BillingSettingsResponse(savedSettings);
    }
    
    // Payment Method Methods
    public List<PaymentMethodResponse> getPaymentMethods(UUID userId) {
        User user = userService.findById(userId);
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtAsc(user);
        
        return paymentMethods.stream()
                .map(PaymentMethodResponse::new)
                .collect(Collectors.toList());
    }
    
    public PaymentMethodResponse addPaymentMethod(UUID userId, AddPaymentMethodRequest request) {
        try {
            User user = userService.findById(userId);
            
            // Check if user already has maximum number of payment methods (e.g., 5)
            long existingCount = paymentMethodRepository.countByUserAndIsActiveTrue(user);
            if (existingCount >= 5) {
                throw new RuntimeException("Maximum number of payment methods reached (5)");
            }
            
            // If this is set as default, clear other defaults
            if (request.getIsDefault()) {
                paymentMethodRepository.clearDefaultByUser(user);
            }
            
            // Create new payment method
            PaymentMethod paymentMethod = new PaymentMethod(user);
            
            // Encrypt sensitive data
            paymentMethod.setCardNumberEncrypted(encryptionService.encrypt(request.getCardNumber()));
            paymentMethod.setCardHolderNameEncrypted(encryptionService.encrypt(request.getCardHolderName()));
            paymentMethod.setExpiryMonthEncrypted(encryptionService.encrypt(request.getExpiryMonth()));
            paymentMethod.setExpiryYearEncrypted(encryptionService.encrypt(request.getExpiryYear()));
            paymentMethod.setCvvEncrypted(encryptionService.encrypt(request.getCvv()));
            
            // Set non-sensitive display information
            String cardNumber = request.getCardNumber().replaceAll("\\D", ""); // Remove non-digits
            if (cardNumber.length() < 4) {
                throw new RuntimeException("Invalid card number");
            }
            paymentMethod.setCardLastFour(cardNumber.substring(cardNumber.length() - 4));
            paymentMethod.setCardBrand(encryptionService.getCardBrand(cardNumber));
            paymentMethod.setCardType(encryptionService.getCardType(cardNumber));
            paymentMethod.setIsDefault(request.getIsDefault());
            
            PaymentMethod savedPaymentMethod = paymentMethodRepository.save(paymentMethod);
            return new PaymentMethodResponse(savedPaymentMethod);
        } catch (Exception e) {
            System.err.println("Error adding payment method: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to add payment method: " + e.getMessage());
        }
    }
    
    public PaymentMethodResponse setDefaultPaymentMethod(UUID userId, UUID paymentMethodId) {
        User user = userService.findById(userId);
        
        // Find the payment method
        PaymentMethod paymentMethod = paymentMethodRepository.findByIdAndUserIdAndIsActiveTrue(paymentMethodId, userId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
        
        // Clear other defaults
        paymentMethodRepository.clearDefaultByUser(user);
        
        // Set this as default
        paymentMethod.setIsDefault(true);
        PaymentMethod savedPaymentMethod = paymentMethodRepository.save(paymentMethod);
        
        return new PaymentMethodResponse(savedPaymentMethod);
    }
    
    public void deletePaymentMethod(UUID userId, UUID paymentMethodId) {
        User user = userService.findById(userId);
        
        // Find the payment method
        PaymentMethod paymentMethod = paymentMethodRepository.findByIdAndUserIdAndIsActiveTrue(paymentMethodId, userId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
        
        // Soft delete
        paymentMethod.setIsActive(false);
        paymentMethodRepository.save(paymentMethod);
        
        // If this was the default, set another as default
        if (paymentMethod.getIsDefault()) {
            List<PaymentMethod> remainingMethods = paymentMethodRepository.findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtAsc(user);
            if (!remainingMethods.isEmpty()) {
                PaymentMethod newDefault = remainingMethods.get(0);
                newDefault.setIsDefault(true);
                paymentMethodRepository.save(newDefault);
            }
        }
    }
    
    private BillingSettings createDefaultBillingSettings(User user) {
        BillingSettings settings = new BillingSettings(user);
        // Default values are already set in the entity
        return billingSettingsRepository.save(settings);
    }
}

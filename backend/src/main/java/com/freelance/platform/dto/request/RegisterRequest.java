package com.freelance.platform.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.freelance.platform.entity.Role;

import java.util.Set;

/**
 * DTO for user registration request.
 * Only CLIENT and FREELANCER roles are allowed for public registration.
 * Admin roles (ADMIN, MODERATOR, SUPER_ADMIN) must be created by Super Admins.
 * Email verification via OTP is required before account activation.
 */
public class RegisterRequest {
    
    @NotBlank
    @Size(min = 2, max = 50)
    private String firstName;
    
    @NotBlank
    @Size(min = 2, max = 50)
    private String lastName;
    
    @NotBlank
    @Size(max = 100)
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 8, max = 100)
    private String password;
    
    /**
     * Required roles for registration. Only CLIENT and FREELANCER are allowed.
     * Attempting to register with ADMIN, MODERATOR, or SUPER_ADMIN roles will be rejected.
     * At least one valid role must be provided.
     */
    @NotNull
    private Set<Role> roles;
    
    private String phone;
    private String country;
    private String city;
    private String timezone;
    private String language = "en";
    
    // Constructors
    public RegisterRequest() {}
    
    public RegisterRequest(String firstName, String lastName, String email, String password, Set<Role> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
    
    // Getters and Setters
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Set<Role> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getTimezone() {
        return timezone;
    }
    
    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
}

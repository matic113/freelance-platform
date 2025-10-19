package com.freelance.platform.service;

import com.freelance.platform.entity.ContactForm;
import com.freelance.platform.entity.ContactStatus;
import com.freelance.platform.repository.ContactFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class ContactFormService {
    
    @Autowired
    private ContactFormRepository contactFormRepository;
    
    public ContactForm submitContactForm(String name, String email, String company, 
                                       String phone, String subject, String category, String message) {
        ContactForm contactForm = new ContactForm(name, email, company, phone, subject, category, message);
        return contactFormRepository.save(contactForm);
    }
    
    public ContactForm getContactFormById(UUID id) {
        return contactFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact form not found with id: " + id));
    }
    
    public Page<ContactForm> getAllContactForms(Pageable pageable) {
        return contactFormRepository.findAll(pageable);
    }
    
    public Page<ContactForm> getContactFormsByStatus(ContactStatus status, Pageable pageable) {
        return contactFormRepository.findByStatus(status, pageable);
    }
    
    public List<ContactForm> getContactFormsByEmail(String email) {
        return contactFormRepository.findByEmail(email);
    }
    
    public ContactForm updateContactFormStatus(UUID id, ContactStatus status, String adminNotes) {
        ContactForm contactForm = getContactFormById(id);
        contactForm.setStatus(status);
        if (adminNotes != null) {
            contactForm.setAdminNotes(adminNotes);
        }
        return contactFormRepository.save(contactForm);
    }
    
    public void deleteContactForm(UUID id) {
        contactFormRepository.deleteById(id);
    }
    
    public Map<String, Object> getContactFormStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long total = contactFormRepository.count();
        long pending = contactFormRepository.countByStatus(ContactStatus.PENDING);
        long inProgress = contactFormRepository.countByStatus(ContactStatus.IN_PROGRESS);
        long resolved = contactFormRepository.countByStatus(ContactStatus.RESOLVED);
        long closed = contactFormRepository.countByStatus(ContactStatus.CLOSED);
        
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);
        stats.put("resolved", resolved);
        stats.put("closed", closed);
        
        // Recent submissions (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<ContactForm> recentSubmissions = contactFormRepository.findByCreatedAtBetween(weekAgo, LocalDateTime.now());
        stats.put("recentSubmissions", recentSubmissions.size());
        
        return stats;
    }
    
    public List<ContactForm> getRecentContactForms(int limit) {
        return contactFormRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .limit(limit)
                .toList();
    }
}

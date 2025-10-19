package com.freelance.platform.service;

import com.freelance.platform.entity.ContactForm;
import com.freelance.platform.entity.FAQ;
import com.freelance.platform.entity.FAQCategory;
import com.freelance.platform.repository.FAQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class ContentService {

    @Autowired
    private com.freelance.platform.repository.PlatformSettingsRepository platformSettingsRepository;
    
    @Autowired
    private ContactFormService contactFormService;
    
    @Autowired
    private FAQRepository faqRepository;

    public Map<String, Object> getPrivacyPolicy() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Privacy Policy");
        content.put("content", "This is the privacy policy content. It outlines how we collect, use, and protect your personal information.");
        content.put("lastUpdated", new Date());
        content.put("version", "1.0");
        
        return content;
    }

    public Map<String, Object> getTermsOfUse() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Terms of Use");
        content.put("content", "This is the terms of use content. It outlines the rules and regulations for using our platform.");
        content.put("lastUpdated", new Date());
        content.put("version", "1.0");
        
        return content;
    }

    public Map<String, Object> getCookiePolicy() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Cookie Policy");
        content.put("content", "This is the cookie policy content. It explains how we use cookies and similar technologies.");
        content.put("lastUpdated", new Date());
        content.put("version", "1.0");
        
        return content;
    }

    public Map<String, Object> getAboutUs() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "About Us");
        content.put("content", "We are a leading freelancer platform connecting talented professionals with clients worldwide.");
        content.put("mission", "To empower freelancers and businesses to work together seamlessly");
        content.put("vision", "To be the world's most trusted freelancer marketplace");
        content.put("founded", "2024");
        content.put("teamSize", "50+");
        content.put("countries", "25+");
        
        return content;
    }

    public Map<String, Object> getSuccessStories() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Success Stories");
        content.put("stories", Arrays.asList(
            Map.of(
                "id", UUID.randomUUID(),
                "title", "From Startup to Success",
                "description", "How a small startup found the perfect developer to build their MVP",
                "client", "TechStart Inc.",
                "freelancer", "John Developer",
                "project", "Mobile App Development",
                "duration", "3 months",
                "budget", "$15,000"
            ),
            Map.of(
                "id", UUID.randomUUID(),
                "title", "Global Design Team",
                "description", "A design agency built a distributed team of talented designers",
                "client", "Creative Agency",
                "freelancer", "Sarah Designer",
                "project", "Brand Identity Design",
                "duration", "6 months",
                "budget", "$25,000"
            )
        ));
        
        return content;
    }

    public Map<String, Object> getClientExperiences() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Client Experiences");
        content.put("testimonials", Arrays.asList(
            Map.of(
                "id", UUID.randomUUID(),
                "clientName", "Michael Johnson",
                "clientTitle", "CEO, TechCorp",
                "rating", 5,
                "comment", "The platform helped us find amazing talent quickly and efficiently.",
                "project", "Web Development",
                "date", new Date()
            ),
            Map.of(
                "id", UUID.randomUUID(),
                "clientName", "Emily Chen",
                "clientTitle", "Marketing Director, StartupXYZ",
                "rating", 5,
                "comment", "Outstanding freelancers and excellent project management tools.",
                "project", "Digital Marketing",
                "date", new Date()
            )
        ));
        
        return content;
    }

    public Map<String, Object> submitContactUs(Map<String, Object> contactData) {
        try {
            // Extract data from the request
            String name = (String) contactData.get("name");
            String email = (String) contactData.get("email");
            String company = (String) contactData.get("company");
            String phone = (String) contactData.get("phone");
            String subject = (String) contactData.get("subject");
            String category = (String) contactData.get("category");
            String message = (String) contactData.get("message");
            
            // Validate required fields
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Name is required");
            }
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required");
            }
            if (subject == null || subject.trim().isEmpty()) {
                throw new IllegalArgumentException("Subject is required");
            }
            if (category == null || category.trim().isEmpty()) {
                throw new IllegalArgumentException("Category is required");
            }
            if (message == null || message.trim().isEmpty()) {
                throw new IllegalArgumentException("Message is required");
            }
            
            // Save to database using ContactFormService
            ContactForm contactForm = contactFormService.submitContactForm(
                name.trim(), email.trim(), 
                company != null ? company.trim() : null,
                phone != null ? phone.trim() : null,
                subject.trim(), category.trim(), message.trim()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thank you for contacting us. We'll get back to you within 24 hours.");
            response.put("ticketId", contactForm.getId().toString());
            response.put("submittedAt", contactForm.getCreatedAt());
            
            return response;
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to submit contact form: " + e.getMessage());
            return response;
        }
    }

    // FAQ Methods
    public Map<String, Object> getFAQs() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<FAQ> faqs = faqRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
            
            // Group FAQs by category
            Map<String, List<Map<String, Object>>> faqsByCategory = new HashMap<>();
            
            for (FAQ faq : faqs) {
                String categoryName = convertCategoryToFrontendFormat(faq.getCategory());
                faqsByCategory.computeIfAbsent(categoryName, k -> new ArrayList<>())
                    .add(Map.of(
                        "id", faq.getId().toString(),
                        "question", faq.getQuestion(),
                        "answer", faq.getAnswer(),
                        "category", faq.getCategory().name(),
                        "displayOrder", faq.getDisplayOrder()
                    ));
            }
            
            response.put("success", true);
            response.put("faqs", faqsByCategory);
            response.put("totalCount", faqs.size());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve FAQs: " + e.getMessage());
        }
        
        return response;
    }

    public Map<String, Object> getFAQsByCategory(String category) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            FAQCategory faqCategory = FAQCategory.valueOf(category.toUpperCase());
            List<FAQ> faqs = faqRepository.findByCategoryAndIsActiveTrueOrderByDisplayOrderAsc(faqCategory);
            
            List<Map<String, Object>> faqList = new ArrayList<>();
            for (FAQ faq : faqs) {
                faqList.add(Map.of(
                    "id", faq.getId().toString(),
                    "question", faq.getQuestion(),
                    "answer", faq.getAnswer(),
                    "category", faq.getCategory().name(),
                    "displayOrder", faq.getDisplayOrder()
                ));
            }
            
            response.put("success", true);
            response.put("faqs", faqList);
            response.put("category", category);
            response.put("count", faqs.size());
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid category: " + category);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve FAQs: " + e.getMessage());
        }
        
        return response;
    }

    public Map<String, Object> searchFAQs(String searchTerm) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<FAQ> faqs = faqRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
            
            // Filter FAQs by search term
            List<Map<String, Object>> filteredFAQs = new ArrayList<>();
            String lowerSearchTerm = searchTerm.toLowerCase();
            
            for (FAQ faq : faqs) {
                if (faq.getQuestion().toLowerCase().contains(lowerSearchTerm) ||
                    faq.getAnswer().toLowerCase().contains(lowerSearchTerm)) {
                    filteredFAQs.add(Map.of(
                        "id", faq.getId().toString(),
                        "question", faq.getQuestion(),
                        "answer", faq.getAnswer(),
                        "category", faq.getCategory().name(),
                        "displayOrder", faq.getDisplayOrder()
                    ));
                }
            }
            
            response.put("success", true);
            response.put("faqs", filteredFAQs);
            response.put("searchTerm", searchTerm);
            response.put("count", filteredFAQs.size());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to search FAQs: " + e.getMessage());
        }
        
        return response;
    }

    public Map<String, Object> getLegalDocument(String type) {
        Map<String, Object> content = new HashMap<>();
        
        switch (type.toLowerCase()) {
            case "privacy":
                return getPrivacyPolicy();
            case "terms":
                return getTermsOfUse();
            case "cookies":
                return getCookiePolicy();
            default:
                content.put("title", "Legal Document");
                content.put("content", "This is a legal document of type: " + type);
                content.put("lastUpdated", new Date());
                content.put("version", "1.0");
        }
        
        return content;
    }

    public Map<String, Object> getBanners() {
        Map<String, Object> banners = new HashMap<>();
        banners.put("banners", Arrays.asList(
            Map.of(
                "id", UUID.randomUUID(),
                "title", "Welcome to Our Platform",
                "description", "Join thousands of freelancers and clients",
                "imageUrl", "/images/banner1.jpg",
                "linkUrl", "/register",
                "isActive", true,
                "position", "top"
            ),
            Map.of(
                "id", UUID.randomUUID(),
                "title", "New Features Available",
                "description", "Check out our latest platform updates",
                "imageUrl", "/images/banner2.jpg",
                "linkUrl", "/features",
                "isActive", true,
                "position", "sidebar"
            )
        ));
        
        return banners;
    }

    public Map<String, Object> getAnnouncements() {
        Map<String, Object> announcements = new HashMap<>();
        announcements.put("announcements", Arrays.asList(
            Map.of(
                "id", UUID.randomUUID(),
                "title", "Platform Maintenance",
                "message", "Scheduled maintenance on Sunday from 2-4 AM EST",
                "type", "maintenance",
                "priority", "high",
                "startDate", new Date(),
                "endDate", new Date(System.currentTimeMillis() + 86400000) // 24 hours from now
            ),
            Map.of(
                "id", UUID.randomUUID(),
                "title", "New Payment Methods",
                "message", "We've added support for additional payment methods",
                "type", "feature",
                "priority", "medium",
                "startDate", new Date(),
                "endDate", new Date(System.currentTimeMillis() + 604800000) // 7 days from now
            )
        ));
        
        return announcements;
    }

    // Helper method to convert enum categories to frontend-friendly format
    private String convertCategoryToFrontendFormat(FAQCategory category) {
        switch (category) {
            case GENERAL:
                return "general";
            case ACCOUNT:
                return "account";
            case PROJECTS:
                return "projects";
            case PAYMENTS:
                return "payments";
            case TECHNICAL:
                return "technical";
            case BILLING:
                return "billing";
            case SECURITY:
                return "security";
            case FEATURES:
                return "features";
            default:
                return "general";
        }
    }
}

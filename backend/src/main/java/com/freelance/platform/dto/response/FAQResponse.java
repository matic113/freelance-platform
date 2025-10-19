package com.freelance.platform.dto.response;

import com.freelance.platform.entity.FAQ;
import com.freelance.platform.entity.FAQCategory;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

public class FAQResponse {
    
    @Schema(description = "FAQ ID")
    private UUID id;
    
    @Schema(description = "FAQ question")
    private String question;
    
    @Schema(description = "FAQ answer")
    private String answer;
    
    @Schema(description = "FAQ category")
    private FAQCategory category;
    
    @Schema(description = "Display order")
    private Integer displayOrder;
    
    @Schema(description = "Is FAQ active")
    private Boolean isActive;
    
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;
    
    // Constructors
    public FAQResponse() {}
    
    public FAQResponse(UUID id, String question, String answer, FAQCategory category, 
                      Integer displayOrder, Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Static factory method
    public static FAQResponse fromEntity(FAQ faq) {
        return new FAQResponse(
            faq.getId(),
            faq.getQuestion(),
            faq.getAnswer(),
            faq.getCategory(),
            faq.getDisplayOrder(),
            faq.getIsActive(),
            faq.getCreatedAt(),
            faq.getUpdatedAt()
        );
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    
    public FAQCategory getCategory() { return category; }
    public void setCategory(FAQCategory category) { this.category = category; }
    
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

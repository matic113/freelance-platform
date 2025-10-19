package com.freelance.platform.dto.request;

import com.freelance.platform.entity.FAQCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

public class UpdateFAQRequest {
    
    @Size(max = 500, message = "Question must not exceed 500 characters")
    @Schema(description = "FAQ question", example = "How do I create a project?")
    private String question;
    
    @Size(max = 2000, message = "Answer must not exceed 2000 characters")
    @Schema(description = "FAQ answer", example = "To create a project, go to the Projects section and click 'Create New Project'.")
    private String answer;
    
    @Schema(description = "FAQ category", example = "PROJECTS")
    private FAQCategory category;
    
    @Schema(description = "Display order", example = "1")
    private Integer displayOrder;
    
    @Schema(description = "Is FAQ active", example = "true")
    private Boolean isActive;
    
    // Constructors
    public UpdateFAQRequest() {}
    
    public UpdateFAQRequest(String question, String answer, FAQCategory category, Integer displayOrder, Boolean isActive) {
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
    }
    
    // Getters and Setters
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
}

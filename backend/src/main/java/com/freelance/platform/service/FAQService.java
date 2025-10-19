package com.freelance.platform.service;

import com.freelance.platform.dto.request.CreateFAQRequest;
import com.freelance.platform.dto.request.UpdateFAQRequest;
import com.freelance.platform.dto.response.FAQResponse;
import com.freelance.platform.entity.FAQ;
import com.freelance.platform.entity.FAQCategory;
import com.freelance.platform.repository.FAQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class FAQService {

    @Autowired
    private FAQRepository faqRepository;

    public FAQResponse createFAQ(CreateFAQRequest request) {
        FAQ faq = new FAQ();
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        faq.setCategory(request.getCategory());
        faq.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        faq.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        
        FAQ savedFAQ = faqRepository.save(faq);
        return FAQResponse.fromEntity(savedFAQ);
    }

    public FAQResponse updateFAQ(UUID id, UpdateFAQRequest request) {
        FAQ faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with ID: " + id));
        
        if (request.getQuestion() != null) {
            faq.setQuestion(request.getQuestion());
        }
        if (request.getAnswer() != null) {
            faq.setAnswer(request.getAnswer());
        }
        if (request.getCategory() != null) {
            faq.setCategory(request.getCategory());
        }
        if (request.getDisplayOrder() != null) {
            faq.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getIsActive() != null) {
            faq.setIsActive(request.getIsActive());
        }
        
        FAQ updatedFAQ = faqRepository.save(faq);
        return FAQResponse.fromEntity(updatedFAQ);
    }

    public void deleteFAQ(UUID id) {
        FAQ faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with ID: " + id));
        faqRepository.delete(faq);
    }

    public FAQResponse getFAQById(UUID id) {
        FAQ faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with ID: " + id));
        return FAQResponse.fromEntity(faq);
    }

    public List<FAQResponse> getAllFAQs() {
        List<FAQ> faqs = faqRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        return faqs.stream()
                .map(FAQResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FAQResponse> getFAQsByCategory(FAQCategory category) {
        List<FAQ> faqs = faqRepository.findByCategoryAndIsActiveTrueOrderByDisplayOrderAsc(category);
        return faqs.stream()
                .map(FAQResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public Page<FAQResponse> searchFAQs(String searchTerm, Pageable pageable) {
        Page<FAQ> faqs = faqRepository.searchFAQs(searchTerm, pageable);
        return faqs.map(FAQResponse::fromEntity);
    }

    public Page<FAQResponse> getAllFAQsPaginated(Pageable pageable) {
        Page<FAQ> faqs = faqRepository.findByIsActiveTrueOrderByDisplayOrderAsc(pageable);
        return faqs.map(FAQResponse::fromEntity);
    }

    public Page<FAQResponse> getFAQsByCategoryPaginated(FAQCategory category, Pageable pageable) {
        Page<FAQ> faqs = faqRepository.findByCategoryAndIsActiveTrueOrderByDisplayOrderAsc(category, pageable);
        return faqs.map(FAQResponse::fromEntity);
    }

    public List<FAQCategory> getAllCategories() {
        return List.of(FAQCategory.values());
    }

    public long getFAQCountByCategory(FAQCategory category) {
        return faqRepository.countByCategoryAndIsActiveTrue(category);
    }
}

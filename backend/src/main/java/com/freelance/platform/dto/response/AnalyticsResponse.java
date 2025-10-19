package com.freelance.platform.dto.response;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class AnalyticsResponse {

    private Integer activeProjects;
    private Integer happyClients;
    private Integer hiredFreelancers;
    private BigDecimal totalEarnings;
    private BigDecimal totalSpending;
    private BigDecimal completionRate;
    private BigDecimal satisfactionRate;
    
    // Admin analytics time-series data (month -> count/amount)
    private Map<String, Object> data;
    private Long total;
    private Long delta;
    private String period;

    // Constructors
    public AnalyticsResponse() {
        this.data = new HashMap<>();
    }

    public AnalyticsResponse(Integer activeProjects, Integer happyClients, Integer hiredFreelancers, 
                           BigDecimal totalEarnings, BigDecimal totalSpending, 
                           BigDecimal completionRate, BigDecimal satisfactionRate) {
        this.activeProjects = activeProjects;
        this.happyClients = happyClients;
        this.hiredFreelancers = hiredFreelancers;
        this.totalEarnings = totalEarnings;
        this.totalSpending = totalSpending;
        this.completionRate = completionRate;
        this.satisfactionRate = satisfactionRate;
        this.data = new HashMap<>();
    }

    // Getters and Setters
    public Integer getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(Integer activeProjects) {
        this.activeProjects = activeProjects;
    }

    public Integer getHappyClients() {
        return happyClients;
    }

    public void setHappyClients(Integer happyClients) {
        this.happyClients = happyClients;
    }

    public Integer getHiredFreelancers() {
        return hiredFreelancers;
    }

    public void setHiredFreelancers(Integer hiredFreelancers) {
        this.hiredFreelancers = hiredFreelancers;
    }

    public BigDecimal getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(BigDecimal totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public BigDecimal getTotalSpending() {
        return totalSpending;
    }

    public void setTotalSpending(BigDecimal totalSpending) {
        this.totalSpending = totalSpending;
    }

    public BigDecimal getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(BigDecimal completionRate) {
        this.completionRate = completionRate;
    }

    public BigDecimal getSatisfactionRate() {
        return satisfactionRate;
    }

    public void setSatisfactionRate(BigDecimal satisfactionRate) {
        this.satisfactionRate = satisfactionRate;
    }
    
    // Admin analytics fields
    public Map<String, Object> getData() {
        return data;
    }
    
    public void setData(Map<String, Object> data) {
        this.data = data;
    }
    
    public Long getTotal() {
        return total;
    }
    
    public void setTotal(Long total) {
        this.total = total;
    }
    
    public Long getDelta() {
        return delta;
    }
    
    public void setDelta(Long delta) {
        this.delta = delta;
    }
    
    public String getPeriod() {
        return period;
    }
    
    public void setPeriod(String period) {
        this.period = period;
    }
}

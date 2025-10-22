package com.freelance.platform.dto.response;

import java.util.UUID;

public class ContractLookupResponse {
    
    private UUID contractId;
    private String status;
    private boolean canOpen;
    private String reason;

    public ContractLookupResponse(UUID contractId, String status, boolean canOpen, String reason) {
        this.contractId = contractId;
        this.status = status;
        this.canOpen = canOpen;
        this.reason = reason;
    }

    public UUID getContractId() {
        return contractId;
    }

    public void setContractId(UUID contractId) {
        this.contractId = contractId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isCanOpen() {
        return canOpen;
    }

    public void setCanOpen(boolean canOpen) {
        this.canOpen = canOpen;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

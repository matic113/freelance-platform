package com.freelance.platform.dto.request;

import com.freelance.platform.entity.MilestoneStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateMilestoneStatusRequest {

    @NotNull(message = "Status is required")
    private MilestoneStatus status;

    public UpdateMilestoneStatusRequest() {}

    public UpdateMilestoneStatusRequest(MilestoneStatus status) {
        this.status = status;
    }

    public MilestoneStatus getStatus() {
        return status;
    }

    public void setStatus(MilestoneStatus status) {
        this.status = status;
    }
}

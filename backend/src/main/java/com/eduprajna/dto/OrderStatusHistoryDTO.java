package com.eduprajna.dto;

import java.time.OffsetDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class OrderStatusHistoryDTO {
    private String status;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime changedAt;

    public OrderStatusHistoryDTO() {}
    public OrderStatusHistoryDTO(String status, OffsetDateTime changedAt) {
        this.status = status;
        this.changedAt = changedAt;
    }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(OffsetDateTime changedAt) { this.changedAt = changedAt; }
}

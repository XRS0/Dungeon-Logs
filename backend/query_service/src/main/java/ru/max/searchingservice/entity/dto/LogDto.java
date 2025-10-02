package ru.max.searchingservice.entity.dto;

import ru.max.searchingservice.entity.Log;

import java.time.Instant;

public class LogDto {
    private Long id;
    private String runId;
    private String workspace;
    private Instant timestamp;
    private String level;
    private String stage;
    private String component;
    private String message;
    private String resourceType;
    private String reqId;

    public LogDto() {}

    public LogDto(Long id, String runId, String workspace, Instant timestamp,
                  String level, String stage, String component,
                  String message, String resourceType, String reqId) {
        this.id = id;
        this.runId = runId;
        this.workspace = workspace;
        this.timestamp = timestamp;
        this.level = level;
        this.stage = stage;
        this.component = component;
        this.message = message;
        this.resourceType = resourceType;
        this.reqId = reqId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRunId() { return runId; }
    public void setRunId(String runId) { this.runId = runId; }

    public String getWorkspace() { return workspace; }
    public void setWorkspace(String workspace) { this.workspace = workspace; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getReqId() { return reqId; }
    public void setReqId(String reqId) { this.reqId = reqId; }

    public static LogDto fromEntity(Log entry) {
        LogDto dto = new LogDto();
        dto.id = entry.getId();
        dto.runId = entry.getRunId();
        dto.workspace = entry.getWorkspace();
        dto.timestamp = entry.getTimestamp();
        dto.level = entry.getLevel();
        dto.stage = entry.getStage();
        dto.component = entry.getComponent();
        dto.message = entry.getMessage();
        dto.resourceType = entry.getResourceType();
        dto.reqId = entry.getReqId();
        return dto;
    }


}

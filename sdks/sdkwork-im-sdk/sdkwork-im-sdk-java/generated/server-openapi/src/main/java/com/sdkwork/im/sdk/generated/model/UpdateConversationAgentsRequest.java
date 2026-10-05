package com.sdkwork.im.sdk.generated.model;

import java.util.List;

public class UpdateConversationAgentsRequest {
    private String expectedGeneration;
    private List<ConversationAgentAssignment> agentAssignments;

    public String getExpectedGeneration() {
        return this.expectedGeneration;
    }

    public void setExpectedGeneration(String expectedGeneration) {
        this.expectedGeneration = expectedGeneration;
    }

    public List<ConversationAgentAssignment> getAgentAssignments() {
        return this.agentAssignments;
    }

    public void setAgentAssignments(List<ConversationAgentAssignment> agentAssignments) {
        this.agentAssignments = agentAssignments;
    }
}

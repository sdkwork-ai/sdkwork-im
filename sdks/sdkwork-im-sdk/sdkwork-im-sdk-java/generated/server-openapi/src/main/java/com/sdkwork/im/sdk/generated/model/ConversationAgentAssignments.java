package com.sdkwork.im.sdk.generated.model;

import java.util.List;

public class ConversationAgentAssignments {
    private String generation;
    private String source;
    private List<ConversationAgentAssignment> agents;

    public String getGeneration() {
        return this.generation;
    }

    public void setGeneration(String generation) {
        this.generation = generation;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public List<ConversationAgentAssignment> getAgents() {
        return this.agents;
    }

    public void setAgents(List<ConversationAgentAssignment> agents) {
        this.agents = agents;
    }
}

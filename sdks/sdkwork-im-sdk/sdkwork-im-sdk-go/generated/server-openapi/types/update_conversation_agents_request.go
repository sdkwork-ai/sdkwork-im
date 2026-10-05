package types


type UpdateConversationAgentsRequest struct {
	ExpectedGeneration string `json:"expectedGeneration"`
	AgentAssignments []ConversationAgentAssignment `json:"agentAssignments"`
}

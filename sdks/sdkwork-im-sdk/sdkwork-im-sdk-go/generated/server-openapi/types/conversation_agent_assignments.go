package types


type ConversationAgentAssignments struct {
	Generation string `json:"generation"`
	Source string `json:"source"`
	Agents []ConversationAgentAssignment `json:"agents"`
}

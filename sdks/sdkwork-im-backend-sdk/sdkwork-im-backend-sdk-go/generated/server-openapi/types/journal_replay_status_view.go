package types


type JournalReplayStatusView struct {
	Status string `json:"status"`
	Mode string `json:"mode"`
	DatabaseConfigured bool `json:"databaseConfigured"`
	JournalReady bool `json:"journalReady"`
	TotalCommits string `json:"totalCommits"`
	HeadCommitOffset string `json:"headCommitOffset"`
	LatestOccurredAt string `json:"latestOccurredAt"`
	Detail string `json:"detail"`
	GeneratedAt string `json:"generatedAt"`
}

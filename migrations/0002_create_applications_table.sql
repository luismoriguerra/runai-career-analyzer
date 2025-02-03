-- Migration number: 0002 	 2025-01-16T00:38:20.881Z

CREATE TABLE applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    company_name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_analysis (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    action_name TEXT NOT NULL,
    action_result TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    ai_messages TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

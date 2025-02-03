-- Migration number: 0003 	 2025-01-16T22:23:17.202Z

create table resumes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table resume_versions (
    id TEXT PRIMARY KEY,
    resume_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    ai_messages TEXT NOT NULL,
    usages TEXT NOT NULL,
    content_previous TEXT NOT NULL,
    content_generated TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

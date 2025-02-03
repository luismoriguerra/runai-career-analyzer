-- Migration number: 0005 	 2025-02-03T21:03:41.900Z

create table application_comments (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    comment TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
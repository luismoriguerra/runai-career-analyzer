-- Migration number: 0006 	 2025-02-05T13:43:39.057Z


create table application_favorites (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
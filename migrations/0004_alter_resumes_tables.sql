-- Migration number: 0004 	 2025-01-17T20:04:14.248Z

alter table resumes add column url TEXT;
alter table resumes add column metadata TEXT;
alter table resumes add column content_optimized TEXT;

alter table resume_versions add column title TEXT;
alter table resume_versions add column model_name TEXT;
alter table resume_versions add column metadata TEXT;




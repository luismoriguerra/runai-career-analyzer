export interface Resume {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface ResumeVersion {
    id: string;
    resume_id: string;
    prompt: string;
    ai_messages: string;
    usages: string;
    content_previous: string;
    content_generated: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface ResumeVersionResponse {
    id: string;
    resume_id: string;
    prompt: string;
    ai_messages: string;
    usages: string;
    content_previous: string;
    content_generated: string;
    title: string;
    created_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 
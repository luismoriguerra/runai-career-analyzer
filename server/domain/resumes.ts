import { nanoid } from 'nanoid';
import { getDb } from '../infrastructure/d1';

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

export class ResumesService {
    constructor(private db: CloudflareEnv["DB"] = getDb()) { }

    async createResume(userId: string, content: string): Promise<Resume> {
        const id = nanoid();
        const now = new Date().toISOString();

        await this.db.prepare(
            `INSERT INTO resumes (id, user_id, content, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)`
        ).bind(id, userId, content, now, now)
            .run();

        return {
            id,
            user_id: userId,
            content,
            created_at: now,
            updated_at: now,
        };
    }

    async getLastResume(userId: string): Promise<Resume> {
        const result = await this.db.prepare(
            'SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
        ).bind(userId)
            .first();

        return result as unknown as Resume;
    }

    async getResumes(userId: string): Promise<Resume[]> {
        const result = await this.db.prepare(
            'SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC'
        ).bind(userId)
            .all();

        return result.results as unknown as Resume[];
    }

    async getResume(id: string, userId: string): Promise<Resume | null> {
        const result = await this.db.prepare(
            'SELECT * FROM resumes WHERE id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1'
        ).bind(id, userId)
            .first();

        return result as Resume | null;
    }

    async updateResume(
        id: string,
        userId: string,
        content: string
    ): Promise<Resume | null> {
        const now = new Date().toISOString();

        await this.db.prepare(
            `UPDATE resumes SET content = ?, updated_at = ? WHERE id = ? AND user_id = ?`
        ).bind(content, now, id, userId)
            .run();

        return this.getResume(id, userId);
    }

    async deleteResume(id: string, userId: string): Promise<void> {
        await this.db.prepare(
            'DELETE FROM resumes WHERE id = ? AND user_id = ?'
        ).bind(id, userId)
            .run();
    }

    // Resume Versions methods
    async createResumeVersion(resumeId: string, data: Pick<ResumeVersion, 'prompt' | 'ai_messages' | 'usages' | 'content_previous' | 'content_generated' | 'title'>): Promise<ResumeVersion> {
        const id = nanoid();
        const now = new Date().toISOString();

        await this.db.prepare(
            `INSERT INTO resume_versions (id, resume_id, prompt, ai_messages, usages, content_previous, content_generated, title, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, resumeId, data.prompt, data.ai_messages, data.usages, data.content_previous, data.content_generated, data.title, now, now)
            .run();

        return {
            id,
            resume_id: resumeId,
            prompt: data.prompt,
            ai_messages: data.ai_messages,
            usages: data.usages,
            content_previous: data.content_previous,
            content_generated: data.content_generated,
            title: data.title,
            created_at: now,
            updated_at: now,
        };
    }

    async getResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
        const result = await this.db.prepare(
            'SELECT * FROM resume_versions WHERE resume_id = ? ORDER BY created_at DESC'
        ).bind(resumeId)
            .all();

        return result.results as unknown as ResumeVersion[];
    }

    async getResumeVersion(id: string, resumeId: string): Promise<ResumeVersion | null> {
        const result = await this.db.prepare(
            'SELECT * FROM resume_versions WHERE id = ? AND resume_id = ?'
        ).bind(id, resumeId)
            .first();

        return result as ResumeVersion | null;
    }

    async updateResumeVersion(
        id: string,
        resumeId: string,
        data: Partial<Pick<ResumeVersion, 'content_generated' | 'ai_messages' | 'usages' | 'title'>>
    ): Promise<ResumeVersion | null> {
        const now = new Date().toISOString();
        const sets: string[] = [];
        const values: string[] = [];

        if (data.content_generated !== undefined) {
            sets.push('content_generated = ?');
            values.push(data.content_generated);
        }
        if (data.ai_messages !== undefined) {
            sets.push('ai_messages = ?');
            values.push(data.ai_messages);
        }
        if (data.usages !== undefined) {
            sets.push('usages = ?');
            values.push(data.usages);
        }
        if (data.title !== undefined) {
            sets.push('title = ?');
            values.push(data.title);
        }

        sets.push('updated_at = ?');
        values.push(now);

        values.push(id, resumeId);

        await this.db.prepare(
            `UPDATE resume_versions SET ${sets.join(', ')} WHERE id = ? AND resume_id = ?`
        ).bind(...values)
            .run();

        return this.getResumeVersion(id, resumeId);
    }

    async deleteResumeVersion(id: string, resumeId: string): Promise<void> {
        await this.db.prepare(
            'DELETE FROM resume_versions WHERE id = ? AND resume_id = ?'
        ).bind(id, resumeId)
            .run();
    }

    async getResumeVersionsPaginated(resumeId: string, page: number = 1, limit: number = 10): Promise<{ data: ResumeVersion[], total: number }> {
        const offset = (page - 1) * limit;

        const countResult = await this.db.prepare(
            'SELECT COUNT(*) as count FROM resume_versions WHERE resume_id = ?'
        ).bind(resumeId)
            .first();

        const total = (countResult as { count: number }).count;

        const result = await this.db.prepare(
            'SELECT * FROM resume_versions WHERE resume_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
        ).bind(resumeId, limit, offset)
            .all();

        return {
            data: result.results as unknown as ResumeVersion[],
            total
        };
    }
} 
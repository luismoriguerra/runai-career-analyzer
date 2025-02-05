import { nanoid } from 'nanoid';

export interface Comment {
    id: string;
    application_id: string;
    application_name?: string;
    comment: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export class CommentsService {
    constructor(private db: CloudflareEnv["DB"]) { }

    async createComment(userId: string, applicationId: string, comment: string): Promise<Comment> {
        const id = nanoid();
        const now = new Date().toISOString();

        await this.db.prepare(
            `INSERT INTO application_comments (id, application_id, comment, user_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(id, applicationId, comment, userId, now, now)
            .run();

        return {
            id,
            application_id: applicationId,
            comment,
            user_id: userId,
            created_at: now,
            updated_at: now,
        };
    }

    async getComments(applicationId: string): Promise<Comment[]> {
        const result = await this.db.prepare(
            'SELECT * FROM application_comments WHERE application_id = ? ORDER BY created_at DESC'
        ).bind(applicationId)
            .all();

        return result.results as unknown as Comment[];
    }

    async getLastUserComments(
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ data: Comment[]; total: number }> {
        const offset = (page - 1) * limit;

        const [commentsResult, totalResult] = await Promise.all([
            this.db.prepare(
                `SELECT 
                    c.*,
                    a.name as application_name
                FROM application_comments c
                INNER JOIN applications a ON c.application_id = a.id
                WHERE c.user_id = ? 
                ORDER BY c.created_at DESC 
                LIMIT ? OFFSET ?`
            ).bind(userId, limit, offset)
                .all(),
            this.db.prepare(
                'SELECT COUNT(*) as count FROM application_comments WHERE user_id = ?'
            ).bind(userId)
                .first()
        ]);

        return {
            data: commentsResult.results as unknown as Comment[],
            total: (totalResult as { count: number }).count
        };
    }
    
    async getComment(id: string, applicationId: string): Promise<Comment | null> {
        const result = await this.db.prepare(
            'SELECT * FROM application_comments WHERE id = ? AND application_id = ?'
        ).bind(id, applicationId)
            .first();

        return result as Comment | null;
    }

    async updateComment(
        id: string,
        applicationId: string,
        userId: string,
        comment: string
    ): Promise<Comment | null> {
        const now = new Date().toISOString();

        await this.db.prepare(
            `UPDATE application_comments 
            SET comment = ?, updated_at = ? 
            WHERE id = ? AND application_id = ? AND user_id = ?`
        ).bind(comment, now, id, applicationId, userId)
            .run();

        return this.getComment(id, applicationId);
    }

    async deleteComment(id: string, applicationId: string, userId: string): Promise<void> {
        await this.db.prepare(
            'DELETE FROM application_comments WHERE id = ? AND application_id = ? AND user_id = ?'
        ).bind(id, applicationId, userId)
            .run();
    }
} 
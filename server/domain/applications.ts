import { nanoid } from 'nanoid';

export interface Application {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    company_name: string;
    created_at: string;
    updated_at: string;
}

export interface ApplicationAnalysis {
    id: string;
    application_id: string;
    action_name: string;
    action_result: string;
    prompt_text: string;
    ai_messages: string;
    created_at: string;
    updated_at: string;
}

export class ApplicationsService {
    constructor(private db: CloudflareEnv["DB"]) { }

    async createApplication(userId: string, data: Pick<Application, 'name' | 'description' | 'company_name'>): Promise<Application> {
        const id = nanoid();
        const now = new Date().toISOString();

        await this.db.prepare(
            `INSERT INTO applications (id, user_id, name, description, company_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, userId, data.name, data.description || null, data.company_name, now, now)
            .run();

        return {
            id,
            user_id: userId,
            name: data.name,
            description: data.description,
            company_name: data.company_name,
            created_at: now,
            updated_at: now,
        };
    }

    async getApplications(userId: string): Promise<Application[]> {
        const result = await this.db.prepare(
            'SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC'
        ).bind(userId)
            .all();

        return result.results as unknown as Application[];
    }

    async getApplication(id: string, userId: string): Promise<Application | null> {
        const query = 'SELECT * FROM applications WHERE id = ? AND user_id = ?';
        const result = await this.db.prepare(query)
            .bind(id, userId)
            .first();

        return result as Application | null;
    }

    async updateApplication(
        id: string,
        userId: string,
        data: Partial<Pick<Application, 'name' | 'description' | 'company_name'>>
    ): Promise<Application | null> {
        const now = new Date().toISOString();
        const sets: string[] = [];
        const values: string[] = [];

        if (data.name !== undefined) {
            sets.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            sets.push('description = ?');
            values.push(data.description);
        }
        if (data.company_name !== undefined) {
            sets.push('company_name = ?');
            values.push(data.company_name);
        }

        sets.push('updated_at = ?');
        values.push(now);

        values.push(id, userId);

        await this.db.prepare(
            `UPDATE applications SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`
        ).bind(...values)
            .run();

        return this.getApplication(id, userId);
    }

    async deleteApplication(id: string, userId: string): Promise<void> {
        await this.db.prepare(
            'DELETE FROM applications WHERE id = ? AND user_id = ?'
        ).bind(id, userId)
            .run();
    }

    // Application Analysis methods
    async createAnalysis(applicationId: string, data: Pick<ApplicationAnalysis, 'action_name' | 'action_result' | 'prompt_text' | 'ai_messages'>): Promise<ApplicationAnalysis> {
        const id = nanoid();
        const now = new Date().toISOString();

        await this.db.prepare(
            `INSERT INTO application_analysis (id, application_id, action_name, action_result, prompt_text, ai_messages, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, applicationId, data.action_name, data.action_result, data.prompt_text, data.ai_messages, now, now)
            .run();

        return {
            id,
            application_id: applicationId,
            action_name: data.action_name,
            action_result: data.action_result,
            prompt_text: data.prompt_text,
            ai_messages: data.ai_messages,
            created_at: now,
            updated_at: now,
        };
    }

    async getAnalyses(applicationId: string, action_name?: string | null): Promise<ApplicationAnalysis[]> {
        const query = action_name 
            ? 'SELECT * FROM application_analysis WHERE application_id = ? AND action_name = ? ORDER BY created_at DESC'
            : 'SELECT * FROM application_analysis WHERE application_id = ? ORDER BY created_at DESC';

        const result = await this.db.prepare(query)
            .bind(...(action_name ? [applicationId, action_name] : [applicationId]))
            .all();

        return result.results as unknown as ApplicationAnalysis[];
    }

    async getAnalysis(id: string, applicationId: string): Promise<ApplicationAnalysis | null> {
        const result = await this.db.prepare(
            'SELECT * FROM application_analysis WHERE id = ? AND application_id = ?'
        ).bind(id, applicationId)
            .first();

        return result as ApplicationAnalysis | null;
    }

    async updateAnalysis(
        id: string,
        applicationId: string,
        data: Partial<Pick<ApplicationAnalysis, 'action_name' | 'action_result' | 'prompt_text' | 'ai_messages'>>
    ): Promise<ApplicationAnalysis | null> {
        const now = new Date().toISOString();
        const sets: string[] = [];
        const values: string[] = [];

        if (data.action_name !== undefined) {
            sets.push('action_name = ?');
            values.push(data.action_name);
        }
        if (data.action_result !== undefined) {
            sets.push('action_result = ?');
            values.push(data.action_result);
        }
        if (data.prompt_text !== undefined) {
            sets.push('prompt_text = ?');
            values.push(data.prompt_text);
        }
        if (data.ai_messages !== undefined) {
            sets.push('ai_messages = ?');
            values.push(data.ai_messages);
        }

        sets.push('updated_at = ?');
        values.push(now);

        values.push(id, applicationId);

        await this.db.prepare(
            `UPDATE application_analysis SET ${sets.join(', ')} WHERE id = ? AND application_id = ?`
        ).bind(...values)
            .run();

        return this.getAnalysis(id, applicationId);
    }

    async deleteAnalysis(id: string, applicationId: string): Promise<void> {
        await this.db.prepare(
            'DELETE FROM application_analysis WHERE id = ? AND application_id = ?'
        ).bind(id, applicationId)
            .run();
    }
} 
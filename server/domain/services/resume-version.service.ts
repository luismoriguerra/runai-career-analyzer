import { generateText } from 'ai';
import { defaultCategoryModel } from '@/server/infrastructure/ai/llm-providers';
import { RESUME_SYSTEM_PROMPT } from '../constants/resume-prompts';
import { ResumeVersion, PaginatedResponse } from '../types/resume-types';
import { ResumesService } from '../resumes';

export class ResumeVersionService {
    constructor(private resumesService: ResumesService) {}

    private generateSystemPrompt(content: string, rebuildId: number): string {
        return `${RESUME_SYSTEM_PROMPT}
            \n\n
            RESUME: ${content}
            \n\n
            REBUILD ID: ${rebuildId}
        `;
    }

    async getVersion(versionId: string, resumeId: string): Promise<ResumeVersion | null> {
        return this.resumesService.getResumeVersion(versionId, resumeId);
    }

    async getVersionsPaginated(resumeId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<ResumeVersion>> {
        const { data, total } = await this.resumesService.getResumeVersionsPaginated(resumeId, page, limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async regenerateVersion(version: ResumeVersion): Promise<ResumeVersion | null> {
        const rebuildId = new Date().getTime();
        
        const { text, usage } = await generateText({
            model: defaultCategoryModel,
            system: this.generateSystemPrompt(version.content_previous, rebuildId),
            maxTokens: 8000,
            prompt: version.prompt,
        });

        return this.resumesService.updateResumeVersion(version.id, version.resume_id, {
            content_generated: text,
            ai_messages: JSON.stringify(usage),
            usages: JSON.stringify(usage),
        });
    }

    async updateVersion(
        versionId: string, 
        resumeId: string, 
        data: Partial<Pick<ResumeVersion, 'content_generated' | 'title'>>
    ): Promise<ResumeVersion | null> {
        return this.resumesService.updateResumeVersion(versionId, resumeId, data);
    }

    async deleteVersion(versionId: string, resumeId: string): Promise<void> {
        await this.resumesService.deleteResumeVersion(versionId, resumeId);
    }
} 
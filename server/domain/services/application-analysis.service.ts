import { generateText } from 'ai';
import { modelByCategory } from '@/server/infrastructure/ai/llm-providers';
import { ACTION_PROMPTS } from '../constants/action-prompts';
import { ActionAnalysis, ActionName } from '../types/application-actions';
import { ApplicationsService } from '../applications';
import { ANALYSIS_SYSTEM_PROMPT } from '../constants/analysis-prompts';
import { Resume, ResumesService } from '../resumes';

export class ApplicationAnalysisService {
    constructor(private applicationsService: ApplicationsService, private resumesService: ResumesService) { }

    private generateSystemPrompt(jobDescription: string, rebuildId: number, resume?: string): string {
        return ANALYSIS_SYSTEM_PROMPT(jobDescription, rebuildId, resume);
    }

    async getAnalysis(applicationId: string, actionName: ActionName, userId: string, rebuild = false): Promise<ActionAnalysis> {
        const application = await this.applicationsService.getApplication(applicationId, userId);
        if (!application) {
            throw new Error('Application not found');
        }

        if (!rebuild) {
            const analyses = await this.applicationsService.getAnalyses(applicationId, actionName);
            if (analyses.length > 0) {
                return {
                    action_name: analyses[0].action_name as ActionName,
                    action_result: analyses[0].action_result,
                    prompt_text: analyses[0].prompt_text,
                    ai_messages: analyses[0].ai_messages
                };
            }
        }

        return this.generateNewAnalysis(application.description ?? '', applicationId, actionName, userId);
    }

    private async generateNewAnalysis(description: string, applicationId: string, actionName: ActionName, userId: string): Promise<ActionAnalysis> {
        const rebuildId = new Date().getTime();
        const { prompt, model, dependencies } = ACTION_PROMPTS[actionName];
        let resume: Resume | null = null;
        
        if (dependencies && dependencies.length > 0 && dependencies.some(dependency => dependency === 'resume')) {
            const resumes = await this.resumesService.getResumes(userId);
            if (resumes.length === 0) {
                throw new Error('Resume not found');
            }

            resume = resumes[0];
        }


        const { text, usage } = await generateText({
            model: model || modelByCategory.fastHermes2Pro8b,
            system: this.generateSystemPrompt(description, rebuildId, resume?.content),
            maxTokens: 4000,
            prompt,
        });

        const analysis = await this.applicationsService.createAnalysis(applicationId, {
            action_name: actionName,
            action_result: text,
            prompt_text: prompt,
            ai_messages: JSON.stringify(usage),
        });

        return {
            action_name: analysis.action_name as ActionName,
            action_result: analysis.action_result,
            prompt_text: analysis.prompt_text,
            ai_messages: analysis.ai_messages
        };
    }
}

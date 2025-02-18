import { ApplicationsService } from '@/server/domain/applications';
import { ACTION_PROMPTS } from '@/server/domain/constants/action-prompts';
import { ANALYSIS_SYSTEM_PROMPT } from '@/server/domain/constants/analysis-prompts';
import { defaultCategoryModel } from '@/server/infrastructure/ai/llm-providers';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { CoreMessage, smoothStream, streamText } from 'ai';
import { NextResponse } from 'next/server';
import { to } from 'await-to-js';
import { ResumesService } from '@/server/domain/resumes';
export const runtime = 'edge';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session?.user?.sub) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.sub;
    const applicationId = params.id;
    const { action_name, rebuild_id } = await req.json() as { action_name: string, messages: CoreMessage[], rebuild_id: number };

    const { prompt, model: promptModel, dependencies } = ACTION_PROMPTS[action_name];

    const applicationsService = new ApplicationsService();

    const application = await applicationsService.getApplication(applicationId, userId);

    if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    let resumeContent = '';

    if (dependencies && dependencies.includes('resume')) {
        const resumeService = new ResumesService();
        const resume = await resumeService.getLastResume(userId);
        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        resumeContent = resume.content;
    }

    const jobDescription = application.description ?? '';


    const systemPrompt = ANALYSIS_SYSTEM_PROMPT(jobDescription, rebuild_id, resumeContent)

    let model = promptModel;
    if (!model) {
        model = defaultCategoryModel
    }

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    console.log(JSON.stringify({
        message: 'fullPrompt',
        data: {
            fullPrompt,
            model,
            dependencies
        }
    }, null, 2));

    const result = streamText({
        model: model ?? defaultCategoryModel,
        experimental_transform: smoothStream({ chunking: 'word' }),
        prompt: fullPrompt,
        maxRetries: 5,
        maxTokens: 8000,
        onError: (error) => {
            console.error(error);
        },
        onFinish: async ({ text, usage }) => {
            console.log(JSON.stringify({
                message: 'onFinish',
                data: {
                    text,
                    usage
                }
            }, null, 2));

            if (text.length === 0) {
                return;
            }

            const [err,] = await to(applicationsService.createAnalysis(applicationId, {
                action_name: action_name,
                action_result: text,
                prompt_text: prompt,
                ai_messages: JSON.stringify(usage),
            }));

            if (err) {
                console.error(err);
            }
        }
    });

    return result.toDataStreamResponse(
        {
            sendUsage: true,
        }
    );
}
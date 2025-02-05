import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { getAIGatewayUrl } from './ai-gateway';

// https://openrouter.ai/models?max_price=0
// https://sdk.vercel.ai/providers/community-providers/openrouter


const LLMName = 'openrouter';

const baseUrl = getAIGatewayUrl(LLMName);

export const openRouterListModels = [
    'meta-llama/llama-3.2-1b-instruct', // cheap development
    'microsoft/phi-4', // cheap prod
    'deepseek/deepseek-chat', // default prod
    'google/gemini-pro-1.5', // long context
    'anthropic/claude-3.5-sonnet:beta', // high quality
]

export const openRouterModels = openRouterListModels.map(model => `${LLMName}::${model}`);

const openrouter = createOpenRouter({
    baseURL: baseUrl,
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
        "X-Title": `Runai - Job Assistant`,
        'cf-aig-authorization': `Bearer ${process.env.CF_AIG_TOKEN}`,
    },
    extraBody: {
        provider: {
            ignore: [
                "Together",
                "Novita",
                "Cloudflare",
                "Fireworks",
                "Featherless",
                "Kluster",
                "Avian"
            ]
        },
    }
});

export const openRouterProvider = (model: string) => openrouter(model);

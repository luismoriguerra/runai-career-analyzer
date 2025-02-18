import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { getAIGatewayUrl } from './ai-gateway';

// https://openrouter.ai/models?max_price=0
// https://sdk.vercel.ai/providers/community-providers/openrouter


const LLMName = 'openrouter';

const baseUrl = getAIGatewayUrl(LLMName);


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

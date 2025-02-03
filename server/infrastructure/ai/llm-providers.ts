import { openRouterModels, openRouterProvider } from "./providers/open-router";

// https://sdk.vercel.ai/providers/ai-sdk-providers


export const models = [
    ...openRouterModels,
]

export const systemDefaultModel = openRouterModels[0];

export const apiProviders = {
    openrouter: openRouterProvider,
}

export const getProvider = (model: string) => {
    const providerName = model.split('::')[0];
    const provider = apiProviders[providerName as keyof typeof apiProviders];
    if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
    }

    return provider(model.split('::')[1]);
}

/**
 * 
 * 
 */

export const cheapestModel = getProvider('openrouter::meta-llama/llama-3.2-1b-instruct');

export const phi4Model = getProvider('openrouter::microsoft/phi-4');
export const deepseekChatModel = getProvider('openrouter::deepseek/deepseek-chat');

export const defaultModel = phi4Model;

export const longContextModel = getProvider('openrouter::google/gemini-pro-1.5');

export const highQualityModel = getProvider('openrouter::anthropic/claude-3.5-sonnet:beta');

export const deepseekR1 = getProvider('openrouter::deepseek/deepseek-r1');

export const hermes2pro = getProvider('openrouter::nousresearch/hermes-2-pro-llama-3-8b');

export const miniMax = getProvider('openrouter::minimax/minimax-01');

export const deepSeekR1DistilLlama70b = getProvider('openrouter::deepseek/deepseek-r1-distill-llama-70b');

export const sonarReasoningWebSearch = getProvider('openrouter::perplexity/sonar-reasoning');

// const stage = process.env.STAGE;

export const getModelBasedOnPrompt = (prompt: string) => {
    console.log(prompt);

    return hermes2pro;
}

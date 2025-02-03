import { getProvider } from '@/server/infrastructure/ai/llm-providers';
import { OpenRouterLanguageModel } from '@openrouter/ai-sdk-provider';

const websearch = getProvider('openrouter::perplexity/sonar-reasoning');
const reasoning = getProvider('openrouter::minimax/minimax-01');
const defaultModel = getProvider('openrouter::nousresearch/hermes-2-pro-llama-3-8b');

export const ACTION_PROMPTS: Record<string, { prompt: string; model?: OpenRouterLanguageModel, dependencies?: string[] }> = {

    "optimize_tokens": {
        prompt: "rewrite this content to be more concise and token-efficient while preserving all key information, details and context. Remove redundancies and use precise language.",
        model: defaultModel
    },
    'bullet_points': {
        prompt: "convert this content into a well-structured bullet point format, maintaining the hierarchy and relationships between ideas",
        model: defaultModel
    },

    // Version 1
    "get_skills": {
        prompt: "Review the job description and extract all relevant skills. Present them as a clear bullet-point list, then compare with the resume details to indicate which skills match and which are missing.",
        model: reasoning,
        dependencies: ['resume']
    },

    "common_interview_questions": {
        prompt: "could you provide me common question that I might have in the interview and how to answer them using my Resume information and the job description?. Include how  to introduce myself and another questions.",
        model: reasoning,
        dependencies: ['resume']
    },



    "get_interview_questions": {
        prompt: "Provide a list of interview questions with the expected answer example that are relevant to the job description. The questions should be well structured in bullet points with the expected answer. and grouped by category and level of difficulty. dont forget to include the question and the expected answer.",
        model: reasoning
    },

    "get_company_info": {
        prompt: "Provide information about the company that is relevant to the job description. The information should be well structured in bullet points. and grouped by category and level of difficulty. provide links in the same response.",
        model: websearch
    },

    "get_learning_resources": {
        prompt: "Provide a list of learning resources that are relevant to the job description. The resources should be well structured in bullet points. and grouped by category and level of difficulty. provide links in the same response.",
        model: websearch
    },

    "get_demo_apps": {
        prompt: `Provide me 3 or 5 demo apps examples following common scenarios to show case the skills and technologies mentioned in the job description.
    Also provide a system design for demo applications that incorporates the main technologies and skills mentioned in the job posting. Consider the following:
   - Architecture (e.g., microservices, monolithic, serverless)
   - Backend and frontend technologies
   - Databases and data storage solutions
   - APIs and integrations
   - Deployment and scalability considerations`,
        model: reasoning
    },


}; 
export const ANALYSIS_SYSTEM_PROMPT = (jobDescription: string, rebuildId?: number,  resume?: string): string => {
    const basePrompt = `You are an AI assistant specialized in analyzing job descriptions. 
Below, you will be provided context wrapped in tags. 
You must respond to the prompt based on the job description. don't explain yourself. only return the response.\n\n`;

    const tags: string[] = [];

    if (jobDescription) {
        tags.push(`<job_description> ${jobDescription} </job_description>`);
    }

    if (resume) {
        tags.push(`<resume> ${resume} </resume>`);
    }

    if (rebuildId !== undefined) {
        tags.push(`<rebuild_id> ${rebuildId} </rebuild_id>`);
    }

    return basePrompt + tags.join('\n\n');
}; 
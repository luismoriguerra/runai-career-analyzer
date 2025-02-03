"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EXAMPLE_PROMPTS = [
    "Tailor your resume to the job description",
    "Provide me improvement points for my resume",
    "Recommend changes to my resume",
    "Recommend tips and tricks to improve my resume",
    "Improve my resume for a software engineer using my Resume. Include start date, end date, and company name., skills, and achievements per work experience.",
    "Provide a well-rounded resume for a software engineer using my Resume. Include start date, end date, and company name., skills, and achievements per work experience.",
    "Create a resume for a marketing manager with a focus on digital marketing",
    "Generate a resume for a data scientist with a strong background in machine learning",
    "Create a resume for a project manager with a focus on agile methodologies",
];

export interface ResumeGeneratorProps {
    onGenerated?: () => void;
}

export function ResumeGenerator({ onGenerated }: ResumeGeneratorProps) {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const truncateText = (text: string, maxLength: number = 25) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast({
                title: "Error",
                description: "Please enter a prompt",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch("/api/resumes/versions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate resume");
            }

            toast({
                title: "Success",
                description: "Resume generation started",
            });

            setPrompt("");
            onGenerated?.();
        } catch {
            toast({
                title: "Error",
                description: "Failed to generate resume",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <h1 className="text-3xl font-bold">Generate New Resume</h1>
            <div className="space-y-4">
                <div>
                    <p className="text-muted-foreground mb-2">Example prompts:</p>
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLE_PROMPTS.map((examplePrompt) => (
                            <TooltipProvider key={examplePrompt}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-secondary/80"
                                            onClick={() => setPrompt(examplePrompt)}
                                        >
                                            {truncateText(examplePrompt)}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-[300px] text-sm">{examplePrompt}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </div>
                <Textarea
                    placeholder="Enter your resume generation prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] resize-none"
                />
                <Button
                    onClick={handleGenerate}
                    className="w-full"
                    disabled={isLoading}
                    size="lg"
                >
                    {isLoading ? "Generating..." : "Generate Resume"}
                </Button>
            </div>
        </div>
    );
} 
'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, RotateCcw, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ResumeVersion as ResumeVersionType } from '@/server/domain/resumes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ResumeVersionProps {
    version: ResumeVersionType;
    onRegenerate: (versionId: string) => Promise<void>;
    onDelete: (versionId: string) => void;
    onUpdateContent: (versionId: string, content: string, title: string) => Promise<void>;
}

export function ResumeVersion({ version, onRegenerate, onDelete, onUpdateContent }: ResumeVersionProps) {
    const [editingContent, setEditingContent] = useState(version.content_generated);
    const [editingTitle, setEditingTitle] = useState(version.title || '');
    const [copyingPrompt, setCopyingPrompt] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('preview');
    const { toast } = useToast();

    const handleCopyContent = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            toast({
                title: "Success",
                description: "Content copied to clipboard",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to copy content",
                variant: "destructive",
            });
        }
    };

    const handleCopyPrompt = async (prompt: string) => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopyingPrompt(true);
            toast({
                title: "Success",
                description: "Prompt copied to clipboard",
            });
            setTimeout(() => setCopyingPrompt(false), 2000);
        } catch {
            toast({
                title: "Error",
                description: "Failed to copy prompt",
                variant: "destructive",
            });
        }
    };

    const handleUpdateContent = async () => {
        try {
            setIsUpdating(true);
            await onUpdateContent(version.id, editingContent, editingTitle);
            setActiveTab('preview');
            toast({
                title: "Success",
                description: "Content updated successfully",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to update content",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Collapsible className="w-full">
            <Card>
                <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-base">
                                {version.title || 'Untitled Version'}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Created on {new Date(version.created_at).toLocaleString()}
                            </p>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                <TabsTrigger value="ai-details">AI Details</TabsTrigger>
                            </TabsList>
                            <TabsContent value="preview" className="mt-4">
                                <div className="prose max-w-none">
                                    <MarkdownRenderer content={version.content_generated} />
                                </div>
                            </TabsContent>
                            <TabsContent value="edit" className="mt-4">
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Version title"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        className="mb-4"
                                        disabled={isUpdating}
                                    />
                                    <Textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        className="min-h-[300px] font-mono"
                                        disabled={isUpdating}
                                    />
                                    <Button 
                                        onClick={handleUpdateContent}
                                        className="w-full"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? "Updating..." : "Update Content"}
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="ai-details" className="mt-4">
                                <div className="space-y-4">
                                    <div className="rounded-lg border bg-card p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">Prompt Used</h4>
                                            <Button
                                                variant={copyingPrompt ? "outline" : "ghost"}
                                                size="sm"
                                                onClick={() => handleCopyPrompt(version.prompt)}
                                                className={copyingPrompt ? "text-green-500" : ""}
                                            >
                                                {copyingPrompt ? (
                                                    <>
                                                        <Check className="h-4 w-4" />
                                                        <span className="ml-2">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        <span className="sr-only">Copy prompt</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                                            {version.prompt}
                                        </pre>
                                    </div>
                                    <div className="rounded-lg border bg-card p-4">
                                        <h4 className="mb-2 font-medium">Previous Content</h4>
                                        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                                            {version.content_previous}
                                        </pre>
                                    </div>
                                    {version.ai_messages && (
                                        <div className="rounded-lg border bg-card p-4">
                                            <h4 className="mb-2 font-medium">AI Usage Details</h4>
                                            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                                                {JSON.stringify(JSON.parse(version.ai_messages), null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyContent(version.content_generated)}
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onRegenerate(version.id)}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Regenerate
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(version.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
} 
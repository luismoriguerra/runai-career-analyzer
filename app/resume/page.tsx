'use client';

import { SetBreadcrumb } from "@/components/set-breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ResumeGenerator } from "@/components/resume-generator";
import { ResumeVersions } from "@/components/resume-versions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResumeVersion } from "@/server/domain/resumes";
export const runtime = 'edge';
export default function ResumePage() {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [versions, setVersions] = useState<ResumeVersion[]>([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(true);
    const { toast } = useToast();

    const fetchResume = useCallback(async () => {
        try {
            const response = await fetch('/api/resumes');
            if (!response.ok) throw new Error('Failed to fetch resume');
            const data = await response.json() as { content: string };
            setContent(data.content);
        } catch (err: unknown) {
            console.error('Failed to load resume:', err);
            toast({
                title: "Error",
                description: "Failed to load resume",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const fetchVersions = useCallback(async () => {
        try {
            setIsLoadingVersions(true);
            const response = await fetch('/api/resumes/versions/list');
            if (!response.ok) throw new Error('Failed to fetch versions');
            const data = await response.json() as { data: ResumeVersion[] };
            setVersions(data.data || []);
        } catch (err: unknown) {
            console.error('Failed to load versions:', err);
            toast({
                title: "Error",
                description: "Failed to load resume versions",
                variant: "destructive",
            });
        } finally {
            setIsLoadingVersions(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchResume();
        fetchVersions();
    }, [fetchResume, fetchVersions]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/resumes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) throw new Error('Failed to save resume');

            toast({
                title: "Success",
                description: "Resume saved successfully",
            });
        } catch (err: unknown) {
            console.error('Failed to save resume:', err);
            toast({
                title: "Error",
                description: "Failed to save resume",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
        fetchVersions();
    };

    const handleRegenerate = async (versionId: string) => {
        try {
            const response = await fetch(`/api/resumes/versions/${versionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ regenerate: true }),
            });

            if (!response.ok) throw new Error('Failed to regenerate version');
            await fetchVersions();
            
            toast({
                title: "Success",
                description: "Version regenerated successfully",
            });
        } catch (error) {
            console.error('Failed to regenerate version:', error);
            toast({
                title: "Error",
                description: "Failed to regenerate version",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (versionId: string) => {
        try {
            const response = await fetch(`/api/resumes/versions/${versionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete version');
            await fetchVersions();
            
            toast({
                title: "Success",
                description: "Version deleted successfully",
            });
        } catch (error) {
            console.error('Failed to delete version:', error);
            toast({
                title: "Error",
                description: "Failed to delete version",
                variant: "destructive",
            });
        }
    };

    const handleUpdateContent = async (versionId: string, content: string, title?: string) => {
        try {
            const response = await fetch(`/api/resumes/versions/${versionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, title }),
            });

            if (!response.ok) throw new Error('Failed to update version');
            await fetchVersions();
            
            toast({
                title: "Success",
                description: "Version updated successfully",
            });
        } catch (error) {
            console.error('Failed to update version:', error);
            toast({
                title: "Error",
                description: "Failed to update version",
                variant: "destructive",
            });
        }
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <SetBreadcrumb
                breadcrumbs={[
                    { label: "Home", route: "/" },
                    { label: "Resume Manager", route: "/resume" },
                ]}
            />

            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Resume Manager</h1>
                    <p className="text-muted-foreground mt-2">
                        View and edit your professional resume
                    </p>
                </div>

                <Collapsible className="w-full">
                    <Card>
                        <CollapsibleTrigger className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Resume Editor</CardTitle>
                                <ChevronDown className="h-4 w-4" />
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent>
                                <Tabs defaultValue="preview" className="w-full">
                                    <TabsList className="w-full flex items-center gap-4 bg-transparent">
                                        <TabsTrigger
                                            value="preview"
                                            className="flex-1 bg-muted/50 data-[state=active]:bg-background"
                                        >
                                            Preview
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="edit"
                                            className="flex-1 bg-muted/50 data-[state=active]:bg-background"
                                        >
                                            Edit
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="edit" className="p-0">
                                        <div className="container mx-auto px-6 py-4">
                                            {isLoading ? (
                                                <div className="flex items-center justify-center min-h-[500px]">
                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                </div>
                                            ) : (
                                                <Textarea
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    className="min-h-[500px] font-mono resize-y"
                                                    placeholder="# Your Name\n\nA brief professional summary..."
                                                />
                                            )}
                                            <div className="mt-4 flex justify-end">
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={isLoading || isSaving}
                                                >
                                                    {isSaving && (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    )}
                                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="preview" className="p-0">
                                        <div className="container mx-auto px-6 py-4">
                                            {isLoading ? (
                                                <div className="flex items-center justify-center min-h-[500px]">
                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                </div>
                                            ) : (
                                                <div className="prose max-w-none">
                                                    <MarkdownRenderer content={content} />
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                <ResumeGenerator onGenerated={handleRefresh} />

                <Card>
                    <CardHeader>
                        <CardTitle>Generated Resumes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingVersions ? (
                            <div className="flex items-center justify-center h-20">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <ResumeVersions 
                                key={refreshKey} 
                                versions={versions}
                                onRegenerate={handleRegenerate}
                                onDelete={handleDelete}
                                onUpdateContent={handleUpdateContent}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
} 
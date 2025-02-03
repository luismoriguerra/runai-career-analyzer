'use client';

import { ResumeVersion as ResumeVersionType } from "@/server/domain/resumes";
import { ResumeVersion } from "./resume-version";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResumeVersionsProps {
    versions: ResumeVersionType[];
    onRegenerate: (versionId: string) => Promise<void>;
    onDelete: (versionId: string) => Promise<void>;
    onUpdateContent: (versionId: string, content: string, title?: string) => Promise<void>;
}

export function ResumeVersions({ versions: initialVersions = [], onRegenerate, onDelete, onUpdateContent }: ResumeVersionsProps) {
    const [versions, setVersions] = useState<ResumeVersionType[]>(initialVersions);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialVersions.length >= 10);
    const { toast } = useToast();

    const loadMore = async () => {
        try {
            setIsLoading(true);
            const nextPage = page + 1;
            const response = await fetch(`/api/resumes/versions/list?page=${nextPage}`);
            if (!response.ok) throw new Error('Failed to load more versions');
            
            const data = await response.json() as { data: ResumeVersionType[] };
            if (!data.data || data.data.length === 0) {
                setHasMore(false);
                return;
            }
            
            setVersions(prev => [...prev, ...data.data]);
            setPage(nextPage);
            setHasMore(data.data.length >= 10);
        } catch (error) {
            console.error('Error loading more versions:', error);
            toast({
                title: "Error",
                description: "Failed to load more versions",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerate = async (versionId: string) => {
        await onRegenerate(versionId);
    };

    const handleDelete = async (versionId: string) => {
        await onDelete(versionId);
        setVersions(prev => prev.filter(v => v.id !== versionId));
    };

    const handleUpdateContent = async (versionId: string, content: string, title?: string) => {
        await onUpdateContent(versionId, content, title);
        setVersions(prev => prev.map(v => 
            v.id === versionId 
                ? { ...v, content_generated: content, ...(title && { title }) }
                : v
        ));
    };

    if (!versions) return null;

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {versions.map((version) => (
                    <ResumeVersion
                        key={version.id}
                        version={version}
                        onRegenerate={handleRegenerate}
                        onDelete={handleDelete}
                        onUpdateContent={handleUpdateContent}
                    />
                ))}
            </div>
            {hasMore && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={loadMore}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Load More"}
                </Button>
            )}
        </div>
    );
} 
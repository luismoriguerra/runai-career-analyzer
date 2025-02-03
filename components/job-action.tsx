'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { MarkdownRenderer } from './MarkdownRenderer';

interface JobActionProps {
  action: string;
}

export function JobAction({ action }: JobActionProps) {
  const params = useParams();
  const { toast } = useToast();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [isCopyingContext, setIsCopyingContext] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (loading) {
      const startTime = Date.now();
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else {
      setElapsedTime(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading]);

  const fetchActionContent = useCallback(async (rebuild: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/applications/${params.id}/actions?action_name=${action}&rebuild=${rebuild}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch action content');
      }
      const data = await response.json() as { action_result: string };
      setContent(data.action_result);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load action content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [action, params.id, toast]);

  useEffect(() => {
    fetchActionContent();
  }, [fetchActionContent]);

  const handleCopyContent = async () => {
    if (!content) return;
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Success",
        description: "Content copied to clipboard",
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleCopyAsContext = async () => {
    if (!content) return;
    setIsCopyingContext(true);
    try {
      await navigator.clipboard.writeText(`<context>${content}</context>`);
      toast({
        title: "Success",
        description: "Content copied as context to clipboard",
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    } finally {
      setIsCopyingContext(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-4 space-y-2">
        <ReloadIcon className="h-4 w-4 animate-spin" />
        <div className="text-sm text-muted-foreground">
          {(elapsedTime / 1000).toFixed(2)}s
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        {content && <MarkdownRenderer content={content} />}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyContent}
          disabled={loading || !content || isCopying}
        >
          {isCopying ? (
            <>
              <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
              Copying...
            </>
          ) : (
            'Copy'
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyAsContext}
          disabled={loading || !content || isCopyingContext}
        >
          {isCopyingContext ? (
            <>
              <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
              Copying...
            </>
          ) : (
            'Copy as Context'
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchActionContent(true)}
          disabled={loading}
        >
          {loading ? (
            <>
              <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
              Regenerating...
            </>
          ) : (
            'Regenerate'
          )}
        </Button>
      </div>
    </div>
  );
} 
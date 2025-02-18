'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { MarkdownRenderer } from './MarkdownRenderer';
import useSWR from 'swr';

interface JobActionProps {
  action: string;
}

interface ActionResponse {
  action_result: string;
}

const fetcher = async (url: string): Promise<ActionResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch action content');
  return res.json();
};

export function JobAction({ action }: JobActionProps) {
  const params = useParams();
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  const [isCopyingContext, setIsCopyingContext] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/applications/${params.id}/actions?action_name=${action}`,
    fetcher
  );

  const content = data?.action_result;

  // const handleRegenerate = useCallback(async () => {
  //   try {
  //     await mutate(
  //       fetcher(`/api/applications/${params.id}/actions?action_name=${action}&rebuild=true`),
  //       { revalidate: true }
  //     );
  //   } catch {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to regenerate content',
  //       variant: 'destructive',
  //     });
  //   }
  // }, [action, mutate, params.id, toast]);

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

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load action content',
      variant: 'destructive',
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-4 space-y-2">
        <ReloadIcon className="h-4 w-4 animate-spin" />
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
          disabled={isLoading || !content || isCopying}
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
          disabled={isLoading || !content || isCopyingContext}
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
          onClick={handleRegenerate}
          disabled={isLoading}
        >
          {isLoading ? (
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
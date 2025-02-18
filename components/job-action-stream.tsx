'use client';

import { useParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface JobActionProps {
  action: string;
}

let didInit = false;

export function JobActionStream({ action }: JobActionProps) {
  const params = useParams();
  const applicationId = params.id as string;

  const { messages, handleSubmit, reload } = useChat({
    api: `/api/applications/${applicationId}/actions-stream`,
    experimental_throttle: 50,
    initialInput: 'We are building this content. Please wait ...',
    body: {
      action_name: action,
    },
    onResponse: (response) => {
      console.log('response', response);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  useEffect(() => {
    if (didInit) {
      return;
    }
    didInit = true;
    handleSubmit({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
  }, [handleSubmit]);

  const onReload = () => {
    reload(
      {
        body: {
          action_name: action,
          rebuild_id: new Date().getTime(),
        }
      }
    );
  }

  const completion = messages[messages.length - 1]
  const assistantMessage = completion?.content;

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex justify-start mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReload()}
          className="flex items-center gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Reload
        </Button>
      </div>
      <div className="flex-1 space-y-4 min-h-[200px] max-h-[500px] overflow-y-auto">
        {assistantMessage && <MarkdownRenderer content={assistantMessage} />}
      </div>

    </div>
  );
} 
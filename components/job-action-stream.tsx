'use client';

import { useParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Button } from "@/components/ui/button";
import { Loader2, RotateCw } from "lucide-react";
import { useEffect, useState } from 'react';
import { ActionResponse } from '@/server/domain/types/application-actions';

interface JobActionProps {
  action: string;
}


const fetcher = async (url: string): Promise<ActionResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch action content');
  return res.json();
};

export function JobActionStream({ action }: JobActionProps) {
  const params = useParams();
  const applicationId = params.id as string;
  const [didInit, setDidInit] = useState(false);
  const [compIsLoading, setCompIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);


  const { messages, setMessages, reload, stop, status } = useChat({
    api: `/api/applications/${applicationId}/actions-stream`,
    experimental_throttle: 50,
    initialInput: 'We are building this content. Please wait ...',
    body: {
      action_name: action,
    },
    // onResponse: (response) => {
    //   console.log('response', response);
    //   setCompIsLoading(false);
    // },
    onFinish(message, options) {
      console.log('message', message);
      console.log('options', options);
      setCompIsLoading(false);
    },
    onError: () => {
      stop();
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'There was an error building this content. Please try again.',
        }
      ]);
      setCompIsLoading(false);
      setErrorCount(errorCount + 1);
      if (errorCount < 3) {
        setTimeout(() => {
          onReload();
        }, 1000);
      }
    },
  });

  useEffect(() => {
    if (didInit) {
      return;
    }
    setCompIsLoading(true);
    setDidInit(true);
    async function fetchData() {
      const data = await fetcher(`/api/applications/${applicationId}/actions?action_name=${action}`);
      if (data) {
        setCompIsLoading(false);
        setMessages([
          {
            id: data.id,
            role: 'assistant',
            content: data.action_result,
          }
        ]);
      } else {
        onReload();
      }
    }

    fetchData();
  }, [didInit]);

  const onReload = async () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'We are rebuilding this content. Please wait ...',
      }
    ]);

    await new Promise(resolve => setTimeout(resolve, 500));

    reload(
      {
        body: {
          action_name: action,
          rebuild_id: new Date().getTime(),
        }
      }
    );
    setCompIsLoading(true);
  }


  const assistantMessage = messages[messages.length - 1]?.content;
  const isLoading = status === 'streaming';

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex justify-start mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReload()}
          className="flex items-center gap-2"
          disabled={isLoading || compIsLoading}
        >
          {isLoading || compIsLoading  ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCw className="h-4 w-4" />
          )}
          {isLoading ? 'Loading...' : 'Reload'}
        </Button>
      </div>
      <div className="flex-1 space-y-4 min-h-[200px] max-h-[500px] overflow-y-auto">
        {assistantMessage && <MarkdownRenderer content={assistantMessage} />}
      </div>

    </div>
  );
} 
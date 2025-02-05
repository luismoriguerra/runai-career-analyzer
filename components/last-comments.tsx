'use client';

import { useEffect, useState } from "react";
import { Comment } from "@/server/domain/comments";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CommentsResponse {
  data: Comment[];
  total: number;
}

export function LastComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleComment = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/comments?limit=10');
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json() as CommentsResponse;
        setComments(data.data);
      } catch (error) {
        console.error('Failed to load comments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">No comments yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 pb-4">
        {comments.map((comment) => {
          const isExpanded = expandedComments.has(comment.id);
          return (
            <Card key={comment.id} className="w-[500px] flex-shrink-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-start">
                      <Link 
                        href={`/applications/${comment.application_id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {comment.application_name || "Unnamed Application"}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {comment.comment}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs"
                      onClick={() => toggleComment(comment.id)}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
} 
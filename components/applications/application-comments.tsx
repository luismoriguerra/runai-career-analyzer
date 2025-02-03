'use client';

import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Comment } from "@/server/domain/comments";
import { CommentItem } from "./comment-item";

export function ApplicationComments() {
  const params = useParams();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications/${params.id}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json() as Comment[];
      setComments(data);
    } catch (error: unknown) {
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

  useEffect(() => {
    fetchComments();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/applications/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment }),
      });

      if (!response.ok) throw new Error('Failed to create comment');
      
      const createdComment = await response.json() as Comment;
      setComments(prev => [createdComment, ...prev] as Comment[]);
      setNewComment("");
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error: unknown) {
      console.error('Failed to add comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/applications/${params.id}/comments/${commentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your comment here..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Comment"}
        </Button>
      </form>

      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
} 
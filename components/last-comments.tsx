

import { CommentsService } from "@/server/domain/comments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { getDb } from "@/server/infrastructure/d1";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { ClientComponent } from "./client-component";



export const runtime = 'edge';

async function getComments() {
  const db = getDb();
  const commentsService = new CommentsService(db);
  const session = await getSession();
  if (!session) {
    return { data: [], total: 0 };
  }
  const comments = await commentsService.getLastUserComments(session.user.sub, 1, 10);
  return comments;
}

export async function LastComments() {

  const { data: comments } = await getComments();

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
          return (
            <Card key={comment.id} className="w-[500px] flex-shrink-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="">
                      <Link
                        href={`/applications/${comment.application_id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {comment.application_name || "Unnamed Application"}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap line-clamp-3`}>
                      <MarkdownRenderer content={comment.comment} />
                    </p>
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
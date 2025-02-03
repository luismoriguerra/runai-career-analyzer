'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationActions } from "./application-actions";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationComments } from "./application-comments";

export function ApplicationTabs() {
  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="chats">Chats</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="analysis">
        <ApplicationActions />
      </TabsContent>

      <TabsContent value="comments">
        <Card>
          <CardContent className="pt-6">
            <ApplicationComments />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chats">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Chat section coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Notes section coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationActions } from "./application-actions";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationComments } from "./application-comments";

export function ApplicationTabs() {
  return (
    <Tabs defaultValue="analysis" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-4 h-12 items-stretch gap-4 bg-muted/50 p-1">
        <TabsTrigger 
          value="analysis"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          Analysis
        </TabsTrigger>
        <TabsTrigger 
          value="comments"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          Comments
        </TabsTrigger>
        <TabsTrigger 
          value="chats"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          Chats
        </TabsTrigger>
        <TabsTrigger 
          value="notes"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          Notes
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="analysis" className="mt-6">
        <ApplicationActions />
      </TabsContent>

      <TabsContent value="comments" className="mt-6">
        <Card className="border-none shadow-none">
          <CardContent className="pt-6 px-0">
            <ApplicationComments />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chats" className="mt-6">
        <Card className="border-none shadow-none">
          <CardContent className="pt-6 px-0">
            <p className="text-muted-foreground">Chat section coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <Card className="border-none shadow-none">
          <CardContent className="pt-6 px-0">
            <p className="text-muted-foreground">Notes section coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 
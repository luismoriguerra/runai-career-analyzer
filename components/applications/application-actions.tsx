'use client';

import { Card, CardContent } from "@/components/ui/card";
import { JobAction } from '@/components/job-action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const actionsList = [
  // {
  //   id: 'description',
  //   title: 'Description',
  //   content: (application: Application) => (
  //     <div className="prose max-w-none">
  //       <p className="whitespace-pre-wrap">{application.description}</p>
  //     </div>
  //   ),
  // },
  // {
  //   id: 'optimizeTokens',
  //   title: 'Optimize Tokens',
  //   content: () => (
  //     <JobAction action="optimize_tokens" />
  //   ),
  // },
  {
    id: 'bullet-points',
    title: 'Bullet Points',
    content: () => (
      <JobAction action="bullet_points" />
    ),
  },
  {
    id: 'skills',
    title: 'Skills',
    content: () => (
      <JobAction action="get_skills" />
    ),
  },
  {
    id: 'company',
    title: 'Company Information',
    content: () => (
      <JobAction action="get_company_info" />
    ),
  },
  {
    id: 'common_interview_questions',
    title: 'Common Questionsfrom your Resume',
    content: () => (
      <JobAction action="common_interview_questions" />
    ),
  },
  {
    id: 'resume-hightlights',
    title: 'Resume Hightlights',
    content: () => (
      <JobAction action="get_resume_hightlights" />
    ),
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter',
    content: () => (
      <JobAction action="get_cover_letter" />
    ),
  },
  {
    id: 'interview-questions',
    title: 'Technical Questions',
    content: () => (
      <JobAction action="get_interview_questions" />
    ),
  },
  {
    id: 'learning',
    title: 'Learning Resources',
    content: () => (
      <JobAction action="get_learning_resources" />
    ),
  },


  {
    id: 'demo-apps',
    title: 'Demo Apps',
    content: () => (
      <JobAction action="get_demo_apps" />
    ),
  },
];

export function ApplicationActions() {
  const tabActions = actionsList.slice(0, 4);
  const accordionActions = actionsList.slice(4);
  const [collapsedTabs, setCollapsedTabs] = useState<Record<string, boolean>>({});

  const toggleCollapse = (tabId: string) => {
    setCollapsedTabs(prev => ({
      ...prev,
      [tabId]: !prev[tabId]
    }));
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue={tabActions[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tabActions.map((action) => (
            <TabsTrigger key={action.id} value={action.id}>
              {action.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabActions.map((action) => (
          <TabsContent key={action.id} value={action.id} className="mt-4">
            <Card>
              <CardContent className="pt-6 relative">
                <div className={cn(
                  "transition-all duration-300 ease-in-out",
                  collapsedTabs[action.id] ? "max-h-[120px]" : "max-h-none",
                  "overflow-hidden"
                )}>
                  <div className={cn(
                    "relative",
                    collapsedTabs[action.id] && "mask-bottom"
                  )}>
                    {action.content()}
                  </div>
                </div>
                <button
                  onClick={() => toggleCollapse(action.id)}
                  className="absolute right-0 top-0 bottom-0 w-6 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                  aria-label="Toggle content height"
                >
                  {collapsedTabs[action.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Additional Actions</h3>
        <Accordion type="single" collapsible className="w-full">
          {accordionActions.map((action) => (
            <AccordionItem key={action.id} value={action.id}>
              <AccordionTrigger>{action.title}</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    {action.content()}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
} 
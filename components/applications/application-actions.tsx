'use client';

import { Card, CardContent } from "@/components/ui/card";
import { JobAction } from '@/components/job-action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    id: 'common_interview_questions',
    title: 'Common Interview Questions',
    content: () => (
      <JobAction action="common_interview_questions" />
    ),
  },
  {
    id: 'interview-questions',
    title: 'Interview Questions',
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
    id: 'company',
    title: 'Company Information',
    content: () => (
      <JobAction action="get_company_info" />
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
  const tabActions = actionsList.slice(0, 8);

  return (
    <div className="space-y-8">
      <Tabs defaultValue={tabActions[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {tabActions.map((action) => (
            <TabsTrigger key={action.id} value={action.id}>
              {action.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabActions.map((action) => (
          <TabsContent key={action.id} value={action.id} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {action.content()}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>


    </div>
  );
} 
'use client';

import { Application } from '@/server/domain/applications';
import { Building2 } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface ApplicationViewProps {
  application: Application;
}

export function ApplicationView({ application }: ApplicationViewProps) {
  return (
    <>
      <CardTitle className="text-2xl">{application.name}</CardTitle>
      <CardDescription className="flex items-center gap-2 text-base">
        <Building2 className="h-4 w-4" />
        {application.company_name}
      </CardDescription>
    </>
  );
} 
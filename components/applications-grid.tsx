'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Application } from '@/server/domain/applications';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export function ApplicationsGrid() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch('/api/applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json() as Application[];
        setApplications(data);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load applications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [toast]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card 
        className="hover:bg-accent/50 transition-colors cursor-pointer border-dashed"
        onClick={() => router.push('/applications/new')}
      >
        <CardHeader className="flex flex-col items-center justify-center h-[150px]">
          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
          <CardTitle className="text-muted-foreground">Add New Application</CardTitle>
          <CardDescription>Track a new job application</CardDescription>
        </CardHeader>
      </Card>

      {applications.map((application) => (
        <Card 
          key={application.id} 
          className="hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => router.push(`/applications/${application.id}`)}
        >
          <CardHeader>
            <CardTitle>{application.name}</CardTitle>
            <CardDescription>
              {application.company_name}
              <br />
              <span className="text-xs text-muted-foreground">
                Applied {new Date(application.created_at).toLocaleDateString()}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
} 
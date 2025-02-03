'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import { Application } from '@/server/domain/applications';

export const runtime = 'edge';

export default function NewApplication() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      company_name: formData.get('company_name') as string,
      description: formData.get('description') as string,
    };

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const result = await response.json() as Application;
      router.push(`/applications/${result.id}`);
      toast({
        title: 'Success',
        description: 'Application created successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create application',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <SetBreadcrumb
        breadcrumbs={[
          { label: 'Home', route: '/' },
          { label: 'New Application', route: '/applications/new' },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>New Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Job Title
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company_name" className="text-sm font-medium">
                  Company Name
                </label>
                <Input
                  id="company_name"
                  name="company_name"
                  placeholder="e.g., Tech Corp"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Job Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Paste the job description here..."
                  className="h-32"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 
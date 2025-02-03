'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Application } from '@/server/domain/applications';
import { ApplicationHeader } from '@/components/applications/application-header';
import { ApplicationEditForm } from '@/components/applications/application-edit-form';
import { ApplicationTabs } from '@/components/applications/application-tabs';
import { Building2 } from 'lucide-react';

export const runtime = 'edge';

export default function ApplicationDetail() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedApplication, setEditedApplication] = useState<Partial<Application>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const response = await fetch(`/api/applications/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch application');
        }
        const data = await response.json() as Application;
        setApplication(data);
        setEditedApplication(data);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load application',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [params.id, toast]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete application');

      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
      router.push('/');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete application',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(editedApplication),
      });

      if (!response.ok) throw new Error('Failed to update application');

      const updatedApplication = await response.json() as Application;
      setApplication(updatedApplication);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Application updated successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update application',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto p-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </main>
    );
  }

  if (!application) {
    return (
      <main className="container mx-auto p-6">
        <p className="text-muted-foreground">Application not found</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      <ApplicationHeader
        application={application}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancelEdit={() => setIsEditing(false)}
        onDelete={handleDelete}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
      />

      <div className="grid gap-6">
        <div className="bg-background border rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {isEditing ? (
              <ApplicationEditForm
                application={editedApplication}
                onChange={setEditedApplication}
              />
            ) : (
              <>
                <h2 className="text-2xl font-semibold">{application.name}</h2>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {application.company_name}
                </div>
              </>
            )}
          </div>
        </div>

        <ApplicationTabs />
      </div>
    </main>
  );
} 
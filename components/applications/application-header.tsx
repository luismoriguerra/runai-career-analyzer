'use client';

import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import { Application } from '@/server/domain/applications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ApplicationHeaderProps {
  application: Application;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
}

export function ApplicationHeader({
  application,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  showDeleteDialog,
  setShowDeleteDialog,
}: ApplicationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <SetBreadcrumb
        breadcrumbs={[
          { label: 'Home', route: '/' },
          { label: application.name, route: `/applications/${application.id}` },
        ]}
      />
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button onClick={onSave}>Save Changes</Button>
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Application</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this application? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={onDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
} 
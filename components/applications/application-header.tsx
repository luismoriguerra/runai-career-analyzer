'use client';

import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import { Application } from '@/server/domain/applications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="flex items-center justify-between relative">
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
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
          </div>
        )}
      </div>
    </div>
  );
} 
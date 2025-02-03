'use client';

import { Application } from '@/server/domain/applications';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ApplicationEditFormProps {
  application: Partial<Application>;
  onChange: (application: Partial<Application>) => void;
}

export function ApplicationEditForm({
  application,
  onChange,
}: ApplicationEditFormProps) {
  return (
    <div className="space-y-4">
      <Input
        value={application.name}
        onChange={(e) =>
          onChange({ ...application, name: e.target.value })
        }
        className="text-2xl font-semibold"
        placeholder="Position Title"
      />
      <Input
        value={application.company_name}
        onChange={(e) =>
          onChange({ ...application, company_name: e.target.value })
        }
        placeholder="Company Name"
      />
      <Textarea
        value={application.description}
        onChange={(e) =>
          onChange({ ...application, description: e.target.value })
        }
        className="min-h-[200px]"
        placeholder="Enter job description..."
      />
    </div>
  );
} 
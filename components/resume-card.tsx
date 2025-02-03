import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function ResumeCard() {
  return (
    <Link href="/resume">
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <div className="rounded-full bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold">Manage Resume</h2>
            <p className="text-sm text-muted-foreground">
              Update and customize your resume
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 
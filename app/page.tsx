import { SetBreadcrumb } from "@/components/set-breadcrumb";
import { ApplicationsGrid } from "@/components/applications-grid";
import { ResumeCard } from "@/components/resume-card";
export const runtime = 'edge';
export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <SetBreadcrumb breadcrumbs={[{ label: "Home", route: "/" }]} />
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Your Applications</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your job applications
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResumeCard />
        </div>

        <ApplicationsGrid />
      </div>
    </main>
  );
}

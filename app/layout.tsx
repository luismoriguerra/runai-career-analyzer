import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { ModeToggle } from "@/components/theme-toggle";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Applications Assistant",
  description: "Applications Assistant - Your AI-powered job application tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider defaultOpen={false}>
              <BreadcrumbProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 flex-1">
                      <SidebarTrigger className="-ml-1" />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <DynamicBreadcrumb />
                    </div>
                    <div className="flex items-center pr-4">
                      <ModeToggle />
                    </div>
                  </header>
                  {children}
                  <Toaster />
                </SidebarInset>
              </BreadcrumbProvider>
            </SidebarProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}


'use client';

import { useAuth } from "@/components/auth-provider";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NotificationCenter } from "@/components/notification-center";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mx-auto" />
          <p className="text-muted-foreground font-medium">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitial = (user.displayName || user.email || 'A').charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear border-b md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h2 className="text-sm font-headline font-bold text-muted-foreground uppercase tracking-widest">Academic Portal</h2>
          </div>
          <div className="flex items-center gap-4">
             <NotificationCenter />
             <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold leading-tight">{user.displayName || user.email}</span>
             </div>
             <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border shadow-sm">
                <span className="text-sm font-bold text-primary">{userInitial}</span>
             </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

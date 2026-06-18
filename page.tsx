
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleOpenWorkspace = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex justify-center">
          <div className="bg-primary p-4 rounded-2xl shadow-xl shadow-primary/20">
            < GraduationCap className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold font-headline text-foreground">
            Master your <span className="text-primary italic">Assignments</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Assigno helps college students track deadlines, breakdown complex tasks with AI, and stay ahead of their academic journey.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-primary/30 transition-all" onClick={handleOpenWorkspace}>
            Open Workspace <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-card rounded-2xl border shadow-sm">
            <h3 className="font-headline font-bold mb-2">Chrono-Filter</h3>
            <p className="text-sm text-muted-foreground">Instantly find assignments by priority or subject.</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border shadow-sm">
            <h3 className="font-headline font-bold mb-2">AI Breakdown</h3>
            <p className="text-sm text-muted-foreground">Let Gemini analyze your tasks into manageable steps.</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border shadow-sm">
            <h3 className="font-headline font-bold mb-2">Deadline Pulse</h3>
            <p className="text-sm text-muted-foreground">Visual highlights for overdue items and upcoming alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

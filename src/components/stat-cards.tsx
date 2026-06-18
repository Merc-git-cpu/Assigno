
"use client";

import { Assignment } from "@/hooks/use-assignments";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { isPast } from "date-fns";

export function StatCards({ assignments }: { assignments: Assignment[] }) {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const overdue = assignments.filter((a) => a.status === "pending" && isPast(a.dueDate)).length;
  const pending = assignments.filter((a) => a.status === "pending" && !isPast(a.dueDate)).length;

  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: total, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/20" },
    { label: "Pending", value: pending, icon: Clock, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
    { label: "Overdue", value: overdue, icon: AlertCircle, color: "text-destructive", bg: "bg-red-100 dark:bg-red-900/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold font-headline">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline font-bold text-lg">Overall Academic Progress</h3>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-3 italic">
            {progress === 100 ? "Amazing work! All caught up." : 
             progress > 75 ? "Almost there! Keep going." : 
             progress > 50 ? "Halfway point passed. Stay focused!" : 
             "Start strong, finish stronger."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

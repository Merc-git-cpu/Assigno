
"use client";

import { useAssignments } from "@/hooks/use-assignments";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState, useMemo, useEffect } from "react";
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  RefreshCw, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const { assignments } = useAssignments();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("");

  useEffect(() => {
    // Avoid hydration mismatch by setting date on mount
    setDate(new Date());
    setLastSynced(format(new Date(), "h:mm a"));
  }, []);

  const selectedAssignments = useMemo(() => {
    if (!date) return [];
    return assignments.filter((a) => isSameDay(a.dueDate, date));
  }, [assignments, date]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(format(new Date(), "h:mm a"));
    }, 1500);
  };

  const getDayStatus = (day: Date) => {
    const dayTasks = assignments.filter(a => isSameDay(a.dueDate, day));
    if (dayTasks.length === 0) return null;
    const hasHighPriority = dayTasks.some(a => a.priority === "High" && a.status === "pending");
    const allCompleted = dayTasks.every(a => a.status === "completed");
    
    if (allCompleted) return "completed";
    if (hasHighPriority) return "urgent";
    return "pending";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tight">Academic Timeline</h1>
          <p className="text-muted-foreground text-lg">Your unified schedule synced across all academic sources.</p>
        </div>
        <div className="flex items-center gap-3 bg-card border px-4 py-2 rounded-2xl shadow-sm">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Sync Status</p>
            <p className="text-xs font-medium">Last updated: {lastSynced}</p>
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={cn(
              "p-2 rounded-xl transition-all",
              isSyncing ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <RefreshCw className={cn("h-5 w-5", isSyncing && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-xl border-none bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Select Date
              </CardTitle>
              <CardDescription>Click a day to view its academic milestones.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl w-full"
                modifiers={{
                  hasAssignment: (day) => assignments.some(a => isSameDay(a.dueDate, day)),
                  urgent: (day) => getDayStatus(day) === "urgent",
                  completed: (day) => getDayStatus(day) === "completed"
                }}
                modifiersClassNames={{
                  hasAssignment: "font-bold text-primary",
                  urgent: "bg-red-50 text-red-600 ring-2 ring-red-200",
                  completed: "bg-green-50 text-green-600 ring-2 ring-green-100"
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Timeline Legend</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <span>High priority tasks pending</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span>All tasks completed for the day</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-primary-foreground/40" />
                  <span>Upcoming milestones</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-7 shadow-xl border-none bg-card flex flex-col min-h-[500px]">
          <CardHeader className="border-b space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-headline font-bold">
                {date ? format(date, "EEEE, MMMM do") : "Daily Schedule"}
              </CardTitle>
              <Badge variant="secondary" className="px-3 py-1 rounded-lg">
                {selectedAssignments.length} {selectedAssignments.length === 1 ? 'Task' : 'Tasks'}
              </Badge>
            </div>
            <CardDescription>Assignments due on this date</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-6 space-y-4">
                {selectedAssignments.length > 0 ? (
                  selectedAssignments.map((a) => (
                    <div 
                      key={a.id} 
                      className={cn(
                        "flex items-center justify-between p-5 rounded-2xl border transition-all group",
                        a.status === "completed" ? "bg-muted/30 border-muted" : "bg-card hover:border-primary hover:shadow-md"
                      )}
                    >
                      <div className="space-y-2 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-primary/5">
                            {a.subject}
                          </Badge>
                          {a.status === "completed" ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-[10px] uppercase font-bold gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Done
                            </Badge>
                          ) : a.priority === "High" ? (
                            <Badge variant="destructive" className="text-[10px] uppercase font-bold gap-1">
                              <AlertCircle className="h-3 w-3" /> Urgent
                            </Badge>
                          ) : null}
                        </div>
                        <h4 className={cn(
                          "font-bold text-xl leading-tight",
                          a.status === "completed" && "line-through text-muted-foreground"
                        )}>
                          {a.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {format(a.dueDate, "h:mm a")}
                          </span>
                          <span className="flex items-center gap-1 uppercase tracking-tighter">
                            {a.priority} Priority
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <div className={cn(
                           "h-10 w-10 rounded-full flex items-center justify-center border",
                           a.status === "completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-primary/5 text-primary border-primary/10"
                         )}>
                           {a.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-muted-foreground space-y-4 text-center">
                    <div className="bg-muted p-6 rounded-full">
                      <CalendarIcon className="h-12 w-12 opacity-20" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-foreground">Clear Schedule</p>
                      <p className="text-sm max-w-[200px] mx-auto">No academic milestones recorded for this day.</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

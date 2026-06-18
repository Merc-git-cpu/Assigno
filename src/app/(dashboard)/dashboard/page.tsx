
"use client";

import { useAssignments, Assignment } from "@/hooks/use-assignments";
import { StatCards } from "@/components/stat-cards";
import { AssignmentCard } from "@/components/assignment-card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Calendar as CalendarIcon, ArrowRight, AlertTriangle, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { AssignmentDialog } from "@/components/assignment-dialog";
import { isToday, isTomorrow, differenceInHours, format } from "date-fns";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { assignments, addAssignment, toggleComplete, deleteAssignment, updateAssignment } = useAssignments();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>();

  const pendingAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status === "pending")
      .slice(0, 6);
  }, [assignments]);

  const urgentAssignments = useMemo(() => {
    return assignments.filter(a => {
      if (a.status === "completed") return false;
      const hoursLeft = differenceInHours(a.dueDate, new Date());
      return hoursLeft >= 0 && hoursLeft <= 6;
    });
  }, [assignments]);

  const quickScheduleItems = useMemo(() => {
    return assignments
      .filter(a => (isToday(a.dueDate) || isTomorrow(a.dueDate)) && a.status === "pending")
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [assignments]);

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingAssignment(undefined);
    setDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, data);
    } else {
      addAssignment(data);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Academic Overview</h1>
          <p className="text-muted-foreground">Welcome back, track your progress and stay productive.</p>
        </div>
        <Button onClick={handleAddClick} className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> New Assignment
        </Button>
      </div>

      {urgentAssignments.length > 0 && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive animate-pulse">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-bold">Urgent Deadline Warning</AlertTitle>
          <AlertDescription>
            You have {urgentAssignments.length} {urgentAssignments.length === 1 ? 'task' : 'tasks'} due in less than 6 hours! 
            <Link href="/assignments" className="ml-2 underline font-bold">Focus on them now &rarr;</Link>
          </AlertDescription>
        </Alert>
      )}

      <StatCards assignments={assignments} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              Critical Tasks
            </h2>
            <Link href="/assignments">
              <Button variant="link" className="text-primary font-bold">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {pendingAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAssignments.map((assignment) => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment} 
                  onToggle={toggleComplete} 
                  onDelete={deleteAssignment}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card border-2 border-dashed rounded-2xl p-12 text-center space-y-4">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold">No pending assignments</p>
                <p className="text-sm text-muted-foreground">You're all caught up! Enjoy your free time or add a new task.</p>
              </div>
              <Button variant="outline" onClick={handleAddClick}>Add First Task</Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-headline font-bold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Quick Schedule
          </h2>
          <div className="bg-card border rounded-2xl p-4 shadow-sm divide-y">
            {quickScheduleItems.length > 0 ? (
              quickScheduleItems.map((a) => (
                <div key={a.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold text-primary uppercase border-primary/20 bg-primary/5">
                        {a.subject}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {isToday(a.dueDate) ? "Today" : "Tomorrow"}
                      </span>
                    </div>
                    <p className="text-sm font-bold truncate leading-tight">{a.title}</p>
                    <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(a.dueDate, "h:mm a")}
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm text-muted-foreground italic">Your schedule is clear for now.</p>
                <p className="text-[10px] text-muted-foreground uppercase">Next 48 Hours</p>
              </div>
            )}
          </div>
          
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <h4 className="font-bold text-sm mb-2">Focus Mode Tip</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use the "AI Breakdown" on any assignment card to split large tasks into manageable 15-minute sprints.
            </p>
          </div>
        </div>
      </div>

      <AssignmentDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        initialData={editingAssignment}
      />
    </div>
  );
}

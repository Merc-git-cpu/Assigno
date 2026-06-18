"use client";

import { Assignment } from "@/hooks/use-assignments";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  MoreVertical, 
  Sparkles,
  Trash2,
  Edit,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { format, isPast, isWithinInterval, addDays, differenceInHours } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { AiBreakdownDialog } from "@/components/ai-breakdown-dialog";

interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string, currentStatus: "pending" | "completed") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (assignment: Assignment) => void;
}

export function AssignmentCard({ assignment, onToggle, onDelete, onEdit }: AssignmentCardProps) {
  const [aiOpen, setAiOpen] = useState(false);
  const isOverdue = assignment.status === "pending" && isPast(assignment.dueDate);
  const isSoon = assignment.status === "pending" && isWithinInterval(assignment.dueDate, {
    start: new Date(),
    end: addDays(new Date(), 1)
  });

  const isUrgent = useMemo(() => {
    if (assignment.status === "completed") return false;
    const hours = differenceInHours(assignment.dueDate, new Date());
    return hours >= 0 && hours < 6;
  }, [assignment.dueDate, assignment.status]);

  const priorityColors = {
    High: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50",
    Medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50",
    Low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50",
  };

  return (
    <>
      <Card className={cn(
        "group transition-all hover:shadow-md border-l-4 relative overflow-hidden",
        assignment.status === "completed" ? "border-l-green-500 opacity-75" : 
        isUrgent ? "border-l-destructive shadow-lg shadow-destructive/10 ring-1 ring-destructive/50" :
        isOverdue ? "border-l-destructive shadow-destructive/10" : 
        isSoon ? "border-l-orange-500" : "border-l-primary"
      )}>
        {isUrgent && (
           <div className="absolute top-0 right-0 p-1 bg-destructive text-destructive-foreground">
             <AlertTriangle className="h-3 w-3 animate-pulse" />
           </div>
        )}
        <CardHeader className="flex flex-row items-start justify-between p-4 space-y-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-wider">{assignment.subject}</Badge>
              <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", priorityColors[assignment.priority])}>
                {assignment.priority}
              </Badge>
            </div>
            <CardTitle className={cn(
              "text-lg font-headline leading-tight pt-1",
              assignment.status === "completed" && "line-through text-muted-foreground"
            )}>
              {assignment.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(assignment)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(assignment.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <div className={cn("flex items-center gap-1.5 font-medium", (isOverdue || isUrgent) && "text-destructive font-bold")}>
              {isOverdue || isUrgent ? <Clock className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
              {format(assignment.dueDate, "MMM d, h:mm a")}
            </div>
          </div>
          {isOverdue && (
            <div className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest inline-block">
              Overdue
            </div>
          )}
          {isUrgent && !isOverdue && (
            <div className="bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest inline-block animate-pulse">
              Final Alert: Due Soon
            </div>
          )}
          {isSoon && !isOverdue && !isUrgent && (
            <div className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest inline-block">
              Due Soon
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 gap-2 flex justify-between items-center">
          <Button 
            variant={assignment.status === "completed" ? "outline" : isUrgent ? "destructive" : "default"} 
            size="sm" 
            className="flex-1 rounded-lg"
            onClick={() => onToggle(assignment.id, assignment.status)}
          >
            {assignment.status === "completed" ? (
              <><RotateCcw className="mr-2 h-4 w-4" /> Reopen Task</>
            ) : isUrgent ? "Finish Now!" : <><CheckCircle2 className="mr-2 h-4 w-4" /> Mark Complete</>}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-lg hover:text-primary hover:bg-primary/10"
            onClick={() => setAiOpen(true)}
            title="AI Breakdown"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <AiBreakdownDialog 
        open={aiOpen} 
        onOpenChange={setAiOpen} 
        description={assignment.description || assignment.title} 
      />
    </>
  );
}


"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  X,
  Info
} from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAssignments } from "@/hooks/use-assignments";
import { useProfile } from "@/hooks/use-profile";
import { differenceInMinutes, isPast } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const { assignments } = useAssignments();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [lastNotifiedIds, setLastNotifiedIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    return assignments
      .filter(a => a.status === "pending")
      .map(a => {
        const minsLeft = differenceInMinutes(a.dueDate, new Date());
        const isOverdue = isPast(a.dueDate);
        
        let type: 'urgent' | 'soon' | 'info' = 'info';
        let message = "";

        if (isOverdue) {
          type = 'urgent';
          message = `Overdue: ${a.title} was due!`;
        } else if (minsLeft <= 60) {
          type = 'urgent';
          message = `Final Hour: ${a.title} is due in ${minsLeft} mins!`;
        } else if (minsLeft <= 360) {
          type = 'soon';
          message = `Due Soon: ${a.title} in less than 6 hours.`;
        }

        return {
          id: a.id,
          title: a.title,
          message,
          type,
          minsLeft,
          isOverdue
        };
      })
      .filter(n => n.message !== "")
      .sort((a, b) => a.minsLeft - b.minsLeft);
  }, [assignments]);

  // Real-time toast reminders for "Final Hour" tasks, respecting profile settings
  useEffect(() => {
    if (profile?.notificationSettings?.urgentAlerts === false) return;

    notifications.forEach(n => {
      if (n.type === 'urgent' && !lastNotifiedIds.has(n.id)) {
        toast({
          title: "Urgent Deadline",
          description: n.message,
          variant: "destructive",
        });
        setLastNotifiedIds(prev => new Set(prev).add(n.id));
      }
    });
  }, [notifications, lastNotifiedIds, toast, profile]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-primary/10 transition-colors">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4 mt-2 border-none shadow-2xl rounded-2xl overflow-hidden" align="end">
        <div className="bg-primary p-4 text-primary-foreground">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold">Notifications</h3>
            <Badge variant="secondary" className="bg-white/20 text-white border-none text-[10px]">
              {notifications.length} Alerts
            </Badge>
          </div>
        </div>
        <ScrollArea className="h-[350px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((n) => (
                <div key={n.id} className={cn(
                  "p-4 flex gap-3 transition-colors hover:bg-muted/50",
                  n.type === 'urgent' && "bg-destructive/5"
                )}>
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                    n.type === 'urgent' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  )}>
                    {n.type === 'urgent' ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium">All clear!</p>
              <p className="text-xs text-muted-foreground">No urgent deadlines detected.</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-2 bg-muted/30 border-t">
          <Button variant="ghost" size="sm" className="w-full text-[10px] uppercase font-bold tracking-widest text-muted-foreground" onClick={() => {}}>
            Dismiss All
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, setHours, setMinutes, parseISO, isValid } from "date-fns";
import { Clock, CalendarIcon } from "lucide-react";
import { Assignment } from "@/hooks/use-assignments";

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: Assignment;
}

export function AssignmentDialog({ open, onOpenChange, onSubmit, initialData }: AssignmentDialogProps) {
  const [dateStr, setDateStr] = useState<string>("");
  const [timeStr, setTimeStr] = useState<string>("23:59");
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          subject: initialData.subject,
          description: initialData.description,
          priority: initialData.priority,
        });
        setDateStr(format(initialData.dueDate, "yyyy-MM-dd"));
        setTimeStr(format(initialData.dueDate, "HH:mm"));
      } else {
        setFormData({
          title: "",
          subject: "",
          description: "",
          priority: "Medium",
        });
        setDateStr(format(new Date(), "yyyy-MM-dd"));
        setTimeStr("23:59");
      }
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedDate = parseISO(dateStr);
    if (!isValid(parsedDate)) return;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const finalDueDate = setMinutes(setHours(parsedDate, hours), minutes);

    onSubmit({
      ...formData,
      dueDate: finalDueDate
    });
    
    // Close immediately for a snappy feel (optimistic UI)
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{initialData ? "Edit Milestone" : "New Academic Task"}</DialogTitle>
          <DialogDescription>
            Document your assignment details and set a firm deadline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">Assignment Title</Label>
            <Input 
              id="title" 
              placeholder="e.g., Advanced Calculus Final Project" 
              required 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="rounded-xl h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider">Subject Code</Label>
              <Input 
                id="subject" 
                placeholder="e.g., MATH402" 
                required 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-wider">Priority Level</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(v: any) => setFormData({...formData, priority: v})}
              >
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider">Due Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
                <Input 
                  id="date"
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="pl-10 rounded-xl h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-xs font-bold uppercase tracking-wider">Due Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
                <Input 
                  id="time"
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="pl-10 rounded-xl h-11"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">Notes & Description</Label>
            <Textarea 
              id="description" 
              placeholder="Break down your goals or paste instructions for AI analysis..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="min-h-[120px] rounded-xl resize-none"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-[2] rounded-xl shadow-lg shadow-primary/20" disabled={!dateStr}>
              {initialData ? "Update Milestone" : "Add to Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

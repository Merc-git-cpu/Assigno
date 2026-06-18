
"use client";

import { useAssignments, Assignment } from "@/hooks/use-assignments";
import { AssignmentCard } from "@/components/assignment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  X,
  LayoutGrid,
  List
} from "lucide-react";
import { useState, useMemo } from "react";
import { AssignmentDialog } from "@/components/assignment-dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AssignmentsPage() {
  const { assignments, addAssignment, toggleComplete, deleteAssignment, updateAssignment } = useAssignments();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.subject.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || a.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [assignments, search, statusFilter, priorityFilter]);

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setDialogOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const handleSubmit = async (data: any) => {
    if (editingAssignment) {
      await updateAssignment(editingAssignment.id, data);
    } else {
      await addAssignment(data);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Assignment Command Center</h1>
          <p className="text-muted-foreground">Manage, sort, and track every academic milestone.</p>
        </div>
        <Button onClick={() => { setEditingAssignment(undefined); setDialogOpen(true); }} className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>

      <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or subject..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          {(search || statusFilter !== "all" || priorityFilter !== "all") && (
            <Button variant="ghost" onClick={clearFilters} className="rounded-xl">
              <X className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
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
        <div className="text-center py-20 bg-card border rounded-2xl">
          <p className="text-muted-foreground italic">No assignments match your current filters.</p>
        </div>
      )}

      <AssignmentDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        initialData={editingAssignment}
      />
    </div>
  );
}

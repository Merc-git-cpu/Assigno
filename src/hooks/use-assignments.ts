'use client';

import { useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAuth } from '@/components/auth-provider';
import { useCollection } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description: string;
  dueDate: Date;
  priority: "High" | "Medium" | "Low";
  status: "pending" | "completed";
  createdAt: Date;
}

export function useAssignments() {
  const { user } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const assignmentsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "assignments"),
      where("userId", "==", user.uid),
      orderBy("dueDate", "asc")
    );
  }, [db, user?.uid]);

  const { data: rawData, loading } = useCollection<any>(assignmentsQuery);

  const assignments = useMemo(() => {
    return rawData.map(d => ({
      ...d,
      dueDate: d.dueDate?.toDate ? d.dueDate.toDate() : new Date(d.dueDate),
      createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt),
    })) as Assignment[];
  }, [rawData]);

  const addAssignment = async (data: Omit<Assignment, "id" | "userId" | "createdAt" | "status">) => {
    if (!user || !db) return;
    
    const payload = {
      ...data,
      userId: user.uid,
      status: "pending",
      createdAt: serverTimestamp(),
      dueDate: Timestamp.fromDate(data.dueDate),
    };

    addDoc(collection(db, "assignments"), payload)
      .then(() => {
        toast({ title: "Milestone Added", description: `${data.title} has been scheduled.` });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'assignments',
          operation: 'create',
          requestResourceData: payload,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const updateAssignment = async (id: string, data: Partial<Assignment>) => {
    if (!db) return;
    const docRef = doc(db, "assignments", id);
    const updateData: any = { ...data };
    if (data.dueDate) updateData.dueDate = Timestamp.fromDate(data.dueDate);

    updateDoc(docRef, updateData)
      .then(() => {
        toast({ title: "Update Saved", description: "Changes have been applied successfully." });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const deleteAssignment = async (id: string) => {
    if (!db) return;
    const docRef = doc(db, "assignments", id);
    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Task Deleted", description: "The assignment was removed from your schedule." });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const toggleComplete = async (id: string, currentStatus: "pending" | "completed") => {
    if (!db) return;
    const docRef = doc(db, "assignments", id);
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    
    updateDoc(docRef, { status: newStatus })
      .then(() => {
        toast({ 
          title: newStatus === 'completed' ? "Great Job!" : "Task Reopened", 
          description: newStatus === 'completed' ? "One step closer to your goals." : "Task moved back to pending."
        });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: newStatus },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return { 
    assignments, 
    loading, 
    addAssignment, 
    updateAssignment, 
    deleteAssignment, 
    toggleComplete 
  };
}

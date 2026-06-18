
'use client';

import { useMemo } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAuth } from '@/components/auth-provider';
import { useDoc } from '@/firebase';

export interface UserProfile {
  displayName: string;
  profession?: string;
  university: string;
  notificationSettings: {
    urgentAlerts: boolean;
    dailySummary: boolean;
  };
}

export function useProfile() {
  const { user } = useAuth();
  const db = useFirestore();

  const profileRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "profiles", user.uid);
  }, [db, user]);

  const { data: profile, loading } = useDoc<any>(profileRef);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !db) return;
    const docRef = doc(db, "profiles", user.uid);
    setDoc(docRef, { 
      displayName: user.displayName,
      ...profile, 
      ...data 
    }, { merge: true });
  };

  return { profile, loading, updateProfile };
}

'use client';

import { useState, useEffect } from 'react';
import { MoodEntry } from '@/types';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { useAuth } from './use-auth';

export function useMoods() {
  const [moods, setMoods] = useState<Record<string, MoodEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'cloud' | 'syncing' | 'error'>('local');
  const { user, isFirebaseConfigured } = useAuth();


  const getEntryByDate = (date: string): MoodEntry | undefined => {
    return moods[date];
  };

  return {
    moods,
    saveEntry,
    getEntryByDate,
    isLoaded,
    syncStatus,
  };
}

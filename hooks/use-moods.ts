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

  // Load from local storage initially
  useEffect(() => {
    const stored = localStorage.getItem('moodcerdos_entries');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMoods(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored moods', e);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  // Sync to Cloud or Local depending on Auth state
  useEffect(() => {
    if (!isLoaded) return;

    const syncWithFirebase = async () => {
      if (!user || !db || !isFirebaseConfigured) {
        setSyncStatus('local');
        // Save to local storage whenever moods change when not logged in
        localStorage.setItem('moodcerdos_entries', JSON.stringify(moods));
        return;
      }

      setSyncStatus('syncing');
      try {
        const moodsRef = collection(db, 'users', user.uid, 'moods');
        
        // Fetch cloud data first
        const snapshot = await getDocs(moodsRef);
        const cloudMoods: Record<string, MoodEntry> = {};
        let hasCloudData = false;

        snapshot.forEach((doc) => {
          cloudMoods[doc.id] = doc.data() as MoodEntry;
          hasCloudData = true;
        });

        // Merge local data into cloud if there is missing data in cloud
        const localMoodsStr = localStorage.getItem('moodcerdos_entries');
        let localMoods: Record<string, MoodEntry> = {};
        if (localMoodsStr) {
          localMoods = JSON.parse(localMoodsStr);
        }

        let needsUpload = false;
        const mergedMoods = { ...cloudMoods };

        for (const [date, localEntry] of Object.entries(localMoods)) {
          if (!cloudMoods[date] || localEntry.updatedAt > cloudMoods[date].updatedAt) {
            mergedMoods[date] = localEntry;
            needsUpload = true;
          }
        }

        // Upload any newer local records to cloud in batch
        if (needsUpload) {
          const batch = writeBatch(db);
          for (const [date, entry] of Object.entries(mergedMoods)) {
             if (!cloudMoods[date] || entry.updatedAt > cloudMoods[date].updatedAt) {
               const docRef = doc(db, 'users', user.uid, 'moods', date);
               batch.set(docRef, entry);
             }
          }
          await batch.commit();
          // Clear local storage after successful migration/sync
          localStorage.removeItem('moodcerdos_entries');
        }

        setMoods(mergedMoods);
        setSyncStatus('cloud');
      } catch (e) {
        console.error("Error syncing with Firebase", e);
        setSyncStatus('error');
        // Fallback to local
        localStorage.setItem('moodcerdos_entries', JSON.stringify(moods));
      }
    };

    // If user state changes to logged in, run initial sync
    if (user && isFirebaseConfigured) {
      syncWithFirebase();
    } else {
      // User logged out or no config, just save local
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSyncStatus('local');
      localStorage.setItem('moodcerdos_entries', JSON.stringify(moods));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isFirebaseConfigured, isLoaded]);

  const saveEntry = async (entry: MoodEntry) => {
    // Update local state immediately for optimistic UI
    const updatedMoods = { ...moods, [entry.date]: entry };
    setMoods(updatedMoods);

    if (user && db && isFirebaseConfigured) {
      setSyncStatus('syncing');
      try {
        const docRef = doc(db, 'users', user.uid, 'moods', entry.date);
        await setDoc(docRef, entry);
        setSyncStatus('cloud');
      } catch (error) {
        console.error("Firestore save error:", error);
        setSyncStatus('error');
        // Save locally as fallback
        localStorage.setItem('moodcerdos_entries', JSON.stringify(updatedMoods));
      }
    } else {
      setSyncStatus('local');
      localStorage.setItem('moodcerdos_entries', JSON.stringify(updatedMoods));
    }
  };

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

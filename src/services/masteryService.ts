import {
  db
} from '../lib/firebase';
import {
  collection, query, orderBy, limit, getDocs, doc, runTransaction, serverTimestamp, addDoc
} from 'firebase/firestore';
import type { MasteryProgress } from '../types/types';

const MASTERY_COLLECTION_NAME = 'masteryProgress';

export const saveMasteryProgress = async (userId: string, progress: Omit<MasteryProgress, "timestamp">) => {
  if (!userId) return;

  if (!progress || typeof progress !== 'object') {
    console.error("Invalid progress passed to saveMasteryProgress");
    return;
  }

  const userMasteryCollectionRef = collection(db, 'users', userId, MASTERY_COLLECTION_NAME);

  try {
    await addDoc(userMasteryCollectionRef, {
      ...progress,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving mastery progress:", error);
  }
};

export const getMasteryProgressHistory = async (userId: string): Promise<MasteryProgress[]> => {
  if (!userId) return [];

  const userMasteryCollectionRef = collection(db, 'users', userId, MASTERY_COLLECTION_NAME);
  const masteryQuery = query(
    userMasteryCollectionRef,
    orderBy('timestamp', 'desc'),
    limit(10) // Limit to last 10 mastery attempts
  );

  const querySnapshot = await getDocs(masteryQuery);
  const masteryProgress: MasteryProgress[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    masteryProgress.push({
      score: data.score,
      attempts: data.attempts,
      timestamp: data.timestamp.toDate(), // Convert Firebase Timestamp to Date object
      documentNames: data.documentNames || [],
    });
  });

  return masteryProgress;
};

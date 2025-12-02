import { 
  db 
} from '../lib/firebase';
import { 
  collection, query, orderBy, limit, getDocs, doc, runTransaction, serverTimestamp 
} from 'firebase/firestore';
import type { GeneratedContent, HistoryItem } from '../types/types';

const HISTORY_COLLECTION_NAME = 'generatedContentHistory';
const MAX_HISTORY_ITEMS = 5;

export const saveGeneratedContent = async (userId: string, content: GeneratedContent) => {
  if (!userId) return;

  if (!content || typeof content !== 'object') {
    console.error("Invalid content passed to saveGeneratedContent");
    return;
  }

  const userHistoryCollectionRef = collection(db, 'users', userId, HISTORY_COLLECTION_NAME);

  // First, query to see if we need to delete old documents
  const historyQuery = query(
    userHistoryCollectionRef,
    orderBy('timestamp', 'asc'),
    limit(MAX_HISTORY_ITEMS)
  );
  const historySnap = await getDocs(historyQuery);

  return await runTransaction(db, async (transaction) => {
    // If we hit the limit, delete the oldest doc (first in ascending order)
    if (historySnap.docs.length >= MAX_HISTORY_ITEMS) {
      const oldestDoc = historySnap.docs[0];
      const oldestDocRef = doc(db, 'users', userId, HISTORY_COLLECTION_NAME, oldestDoc.id);
      transaction.delete(oldestDocRef);
    }

    // Create new doc
    const newDocRef = doc(userHistoryCollectionRef);
    transaction.set(newDocRef, {
      ...content,
      timestamp: serverTimestamp(),
    });

    return newDocRef.id;
  });
};

export const getGeneratedContentHistory = async (userId: string): Promise<HistoryItem[]> => {
  if (!userId) return [];

  const userHistoryCollectionRef = collection(db, 'users', userId, HISTORY_COLLECTION_NAME);
  const historyQuery = query(
    userHistoryCollectionRef,
    orderBy('timestamp', 'desc'),
    limit(MAX_HISTORY_ITEMS)
  );

  const querySnapshot = await getDocs(historyQuery);
  const historyItems: HistoryItem[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    historyItems.push({
      id: doc.id,
      name: data.summaries?.short || data.quiz?.mcqs[0]?.question || "Untitled Session", // Use a generated name or default
      content: {
        summaries: data.summaries || null,
        flashcards: data.flashcards || null,
        quiz: data.quiz || null,
      },
      timestamp: data.timestamp.toDate(),
    });
  });

  return historyItems;
};

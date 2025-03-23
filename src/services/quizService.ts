
import { doc, collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Question } from '../context/QuizContext';

interface QuizResult {
  userId: string;
  topic: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: (number | null)[];
  timestamp: Date;
}

export async function saveQuizResult(quizResult: Omit<QuizResult, 'timestamp'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'quizResults'), {
      ...quizResult,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
}

export async function getUserQuizResults(userId: string): Promise<QuizResult[]> {
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamp to JS Date
      return {
        ...data,
        timestamp: data.timestamp.toDate ? new Date(data.timestamp.toDate()) : new Date()
      } as QuizResult;
    });
  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    throw error;
  }
}

export async function getTopScores(topic: string, limitCount: number = 10): Promise<QuizResult[]> {
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('topic', '==', topic),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: data.timestamp.toDate ? new Date(data.timestamp.toDate()) : new Date()
      } as QuizResult;
    });
  } catch (error) {
    console.error('Error fetching top scores:', error);
    throw error;
  }
}

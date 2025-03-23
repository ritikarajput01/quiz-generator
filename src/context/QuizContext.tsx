
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizState {
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  isLoading: boolean;
  error: string | null;
}

interface QuizContextType {
  quizState: QuizState;
  setTopic: (topic: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setQuestions: (questions: Question[]) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  answerQuestion: (optionIndex: number) => void;
  resetQuiz: () => void;
  startNewQuiz: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  calculateScore: () => number;
  isQuizComplete: () => boolean;
}

const initialQuizState: QuizState = {
  topic: '',
  difficulty: 'medium',
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isLoading: false,
  error: null,
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);

  const setTopic = (topic: string) => {
    setQuizState((prev) => ({ ...prev, topic }));
  };

  const setDifficulty = (difficulty: Difficulty) => {
    setQuizState((prev) => ({ ...prev, difficulty }));
  };

  const setQuestions = (questions: Question[]) => {
    setQuizState((prev) => ({
      ...prev,
      questions,
      userAnswers: Array(questions.length).fill(null),
      currentQuestionIndex: 0,
    }));
  };

  const goToNextQuestion = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const goToPreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const answerQuestion = (optionIndex: number) => {
    const newUserAnswers = [...quizState.userAnswers];
    newUserAnswers[quizState.currentQuestionIndex] = optionIndex;

    setQuizState((prev) => ({
      ...prev,
      userAnswers: newUserAnswers,
    }));
  };

  const resetQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: 0,
      userAnswers: Array(prev.questions.length).fill(null),
    }));
  };

  const startNewQuiz = () => {
    setQuizState(initialQuizState);
  };

  const setLoading = (isLoading: boolean) => {
    setQuizState((prev) => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setQuizState((prev) => ({ ...prev, error }));
  };

  const calculateScore = () => {
    let score = 0;
    quizState.questions.forEach((q, index) => {
      if (quizState.userAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const isQuizComplete = () => {
    return quizState.userAnswers.every((answer) => answer !== null);
  };

  const value = {
    quizState,
    setTopic,
    setDifficulty,
    setQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    answerQuestion,
    resetQuiz,
    startNewQuiz,
    setLoading,
    setError,
    calculateScore,
    isQuizComplete,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

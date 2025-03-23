
import React from 'react';
import QuizForm from '../components/QuizForm';
import { useAuth } from '../context/AuthContext';

const Index: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md mx-auto text-center mb-10 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          <span className="text-primary">Quiz</span>Crafter AI
        </h1>
        
        <p className="text-muted-foreground text-base sm:text-lg mb-2">
          Generate custom quizzes on any topic instantly using AI
        </p>
        
        {!currentUser && (
          <p className="text-sm text-muted-foreground">
            Sign in to create and save your quizzes
          </p>
        )}
      </div>
      
      <div className="w-full">
        <QuizForm />
      </div>
    </div>
  );
};

export default Index;

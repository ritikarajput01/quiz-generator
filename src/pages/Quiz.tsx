
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import QuizQuestion from '../components/QuizQuestion';
import ProgressBar from '../components/ProgressBar';
import { BookOpen, Brain, Zap } from 'lucide-react';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { quizState } = useQuiz();
  
  // Redirect if no questions loaded
  useEffect(() => {
    if (quizState.questions.length === 0) {
      navigate('/');
    }
  }, [quizState.questions, navigate]);

  const handleQuizComplete = () => {
    navigate('/results');
  };

  const getDifficultyIcon = () => {
    switch (quizState.difficulty) {
      case 'easy':
        return <BookOpen size={18} className="mr-1" />;
      case 'medium':
        return <Brain size={18} className="mr-1" />;
      case 'hard':
        return <Zap size={18} className="mr-1" />;
      default:
        return null;
    }
  };

  if (quizState.questions.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold">{quizState.topic}</h1>
          <div className="flex items-center mt-1">
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm">
              {getDifficultyIcon()}
              <span className="capitalize">{quizState.difficulty}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-60">
          <ProgressBar />
        </div>
      </div>
      
      <div className="w-full bg-card border border-border rounded-xl p-6 shadow-sm">
        <QuizQuestion onComplete={handleQuizComplete} />
      </div>
    </div>
  );
};

export default Quiz;

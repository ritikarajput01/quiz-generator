
import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Progress } from '../components/ui/progress';

const ProgressBar: React.FC = () => {
  const { quizState } = useQuiz();
  
  const totalQuestions = quizState.questions.length;
  const answeredQuestions = quizState.userAnswers.filter(ans => ans !== null).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{answeredQuestions} of {totalQuestions} answered</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default ProgressBar;

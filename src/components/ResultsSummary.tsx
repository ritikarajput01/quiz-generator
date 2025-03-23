
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import { Progress } from '../components/ui/progress';

const ResultsSummary: React.FC = () => {
  const navigate = useNavigate();
  const { quizState, calculateScore, resetQuiz, startNewQuiz } = useQuiz();
  
  const score = calculateScore();
  const totalQuestions = quizState.questions.length;
  const scorePercentage = (score / totalQuestions) * 100;
  
  const getFeedback = () => {
    if (scorePercentage >= 80) {
      return "Excellent job! You're a master of this topic!";
    } else if (scorePercentage >= 60) {
      return "Great work! You have a solid understanding of this subject.";
    } else if (scorePercentage >= 40) {
      return "Good effort! With a bit more study, you'll improve your score.";
    } else {
      return "Keep practicing! This topic might need some more review.";
    }
  };

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-500";
    if (scorePercentage >= 60) return "text-blue-500";
    if (scorePercentage >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const handleTryAgain = () => {
    resetQuiz();
    navigate('/quiz');
  };

  const handleNewQuiz = () => {
    startNewQuiz();
    navigate('/');
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
        <p className="text-muted-foreground mb-4">{quizState.topic} - {quizState.difficulty} difficulty</p>
        
        <div className="mb-4">
          <div className="text-4xl font-bold mb-2">
            <span className={getScoreColor()}>{score}</span>
            <span className="text-foreground">/{totalQuestions}</span>
          </div>
          <Progress value={scorePercentage} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            You scored {Math.round(scorePercentage)}%
          </p>
        </div>
        
        <p className="text-base">{getFeedback()}</p>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Question Summary</h3>
        
        {quizState.questions.map((question, index) => {
          const userAnswer = quizState.userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          
          return (
            <div key={index} className="flex items-start space-x-3 py-2">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium line-clamp-2">{question.text}</p>
                
                <div className="text-xs text-muted-foreground space-x-1">
                  <span>Your answer: </span>
                  <span className={cn(isCorrect ? "text-green-500" : "text-red-500", "font-medium")}>
                    {question.options[userAnswer as number]}
                  </span>
                  
                  {!isCorrect && (
                    <>
                      <span> • Correct: </span>
                      <span className="text-green-500 font-medium">
                        {question.options[question.correctAnswer]}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-col gap-3">
        <Button onClick={handleTryAgain} className="w-full transition-all-200">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        
        <Button onClick={handleNewQuiz} variant="outline" className="w-full transition-all-200">
          <Home className="mr-2 h-4 w-4" />
          New Quiz
        </Button>
      </div>
    </div>
  );
};

export default ResultsSummary;

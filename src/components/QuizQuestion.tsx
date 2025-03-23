
import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuizQuestionProps {
  onComplete: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ onComplete }) => {
  const { 
    quizState, 
    answerQuestion, 
    goToNextQuestion, 
    goToPreviousQuestion,
    isQuizComplete
  } = useQuiz();

  const { questions, currentQuestionIndex, userAnswers } = quizState;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  if (!currentQuestion) {
    return <div>No question available</div>;
  }

  const handleOptionSelect = (optionIndex: number) => {
    answerQuestion(optionIndex);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      if (isQuizComplete()) {
        onComplete();
      }
    } else {
      goToNextQuestion();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8 space-y-1">
        <p className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
      </div>

      <RadioGroup 
        value={currentAnswer !== null ? currentAnswer.toString() : undefined} 
        onValueChange={(value) => handleOptionSelect(Number(value))}
        className="space-y-3"
      >
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="relative transition-transform-300 hover:translate-x-1">
            <RadioGroupItem
              value={index.toString()}
              id={`option-${index}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`option-${index}`}
              className={cn(
                "flex items-center justify-between rounded-lg border-2 border-muted p-4",
                "hover:border-primary/70 hover:bg-accent peer-data-[state=checked]:border-primary",
                "peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all-200"
              )}
            >
              <span className="text-base">{option}</span>
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2",
                "peer-data-[state=checked]:bg-primary peer-data-[state=checked]:border-primary",
                "peer-data-[state=checked]:text-primary-foreground",
                userAnswers[currentQuestionIndex] === index ? "bg-primary border-primary text-primary-foreground" : "border-muted"
              )}>
                {String.fromCharCode(65 + index)}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="space-x-2 transition-all-200"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentAnswer === null}
          className="space-x-2 transition-all-200"
        >
          {isLastQuestion && isQuizComplete() ? (
            <>
              <span>Finish</span>
              <Send size={16} />
            </>
          ) : (
            <>
              <span>Next</span>
              <ChevronRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestion;

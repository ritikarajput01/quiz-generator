
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz, Difficulty } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { generateQuiz } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BookOpen, Brain, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';

const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    quizState, 
    setTopic, 
    setDifficulty, 
    setQuestions, 
    setLoading, 
    setError 
  } = useQuiz();
  
  const { currentUser, signInWithGoogle, signInWithGithub } = useAuth();
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [topicInput, setTopicInput] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topicInput.trim()) {
      toast.error('Please enter a topic for your quiz');
      return;
    }

    // Check if user is logged in
    if (!currentUser) {
      setShowLoginDialog(true);
      return;
    }

    generateQuizAfterAuth();
  };

  const generateQuizAfterAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      setTopic(topicInput);
      setDifficulty(selectedDifficulty);
      
      toast.info('Generating your quiz...', {
        duration: 5000,
      });
      
      const questions = await generateQuiz(topicInput, selectedDifficulty, numQuestions);
      setQuestions(questions);
      
      toast.success('Quiz generated successfully!');
      navigate('/quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate quiz');
      
      // Show a more helpful error message
      if (error instanceof Error) {
        if (error.message.includes('JSON')) {
          toast.error('Failed to generate quiz: Invalid response format. Try a different topic or try again later.');
        } else if (error.message.includes('API error')) {
          toast.error('API error: The quiz service is temporarily unavailable. Please try again later.');
        } else {
          toast.error(`Failed to generate quiz: ${error.message}`);
        }
      } else {
        toast.error('Failed to generate quiz. Please try a different topic or try again later.');
      }
    } finally {
      setLoading(false);
      setShowLoginDialog(false);
    }
  };

  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGithub();
      }
      // After successful login, generate the quiz
      generateQuizAfterAuth();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        {/* Topic input field */}
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-base font-medium">Quiz Topic</Label>
          <Input
            id="topic"
            type="text"
            placeholder="Enter any topic (e.g., Solar System, Renaissance Art)"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="h-12"
            required
          />
        </div>

        {/* Difficulty selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Difficulty Level</Label>
          <RadioGroup 
            defaultValue={selectedDifficulty} 
            onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
            className="grid grid-cols-3 gap-3"
          >
            {/* Easy option */}
            <div className="relative">
              <RadioGroupItem 
                value="easy" 
                id="easy" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="easy" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all-200"
              >
                <BookOpen className="mb-2 h-5 w-5" />
                <span className="text-sm font-medium">Easy</span>
              </Label>
            </div>
            
            {/* Medium option */}
            <div className="relative">
              <RadioGroupItem 
                value="medium" 
                id="medium" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="medium" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all-200"
              >
                <Brain className="mb-2 h-5 w-5" />
                <span className="text-sm font-medium">Medium</span>
              </Label>
            </div>
            
            {/* Hard option */}
            <div className="relative">
              <RadioGroupItem 
                value="hard" 
                id="hard" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="hard" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all-200"
              >
                <Zap className="mb-2 h-5 w-5" />
                <span className="text-sm font-medium">Hard</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Number of questions */}
        <div className="space-y-2">
          <Label htmlFor="numQuestions" className="text-base font-medium">Number of Questions</Label>
          <Select 
            value={numQuestions.toString()} 
            onValueChange={(value) => setNumQuestions(parseInt(value))}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Questions</SelectItem>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
              <SelectItem value="15">15 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium transition-all-200"
          disabled={quizState.isLoading}
        >
          {quizState.isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Quiz...
            </>
          ) : 'Create Quiz'}
        </Button>
      </form>

      {/* Authentication Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className={`${isMobile ? 'w-[95vw] rounded-lg' : 'sm:max-w-md'}`}>
          <DialogHeader>
            <DialogTitle>Sign in to create a quiz</DialogTitle>
            <DialogDescription>
              Please sign in to generate and save your quizzes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button 
              onClick={() => handleLogin('google')} 
              variant="outline" 
              className="w-full"
            >
              Sign in with Google
            </Button>
            <Button 
              onClick={() => handleLogin('github')} 
              variant="outline" 
              className="w-full"
            >
              Sign in with GitHub
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizForm;

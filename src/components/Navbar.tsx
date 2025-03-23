
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Moon, Sun, Home, Menu } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Button } from '../components/ui/button';
import AuthButtons from './AuthButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { startNewQuiz } = useQuiz();

  const handleHomeClick = () => {
    startNewQuiz();
    navigate('/');
  };

  // Mobile menu content
  const NavMenuContent = () => (
    <div className="flex flex-col space-y-4 mt-8">
      <Button
        variant="ghost"
        onClick={handleHomeClick}
        className="justify-start"
      >
        <Home size={20} className="mr-2" />
        Home
      </Button>
      <Button
        variant="ghost"
        onClick={toggleDarkMode}
        className="justify-start"
      >
        {isDarkMode ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </Button>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-black/50 border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link 
          to="/" 
          className="flex items-center space-x-2 font-bold text-lg tracking-tight transition-all-200 hover:text-primary"
          onClick={startNewQuiz}
        >
          <span className="text-primary">Quiz</span>
          <span>Crafter</span>
          <span className="text-primary">AI</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4">
                  <AuthButtons />
                  <NavMenuContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <AuthButtons />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHomeClick}
              className="transition-all-200"
              aria-label="Home"
            >
              <Home size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="transition-all-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

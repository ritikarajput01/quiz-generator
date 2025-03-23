
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check for user preference from localStorage
    const storedTheme = localStorage.getItem("theme");
    const initialDarkMode = storedTheme === "dark" || 
      (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle("dark", initialDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <QuizProvider>
            <Toaster />
            <Sonner position="top-center" />
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                <main className="pt-16 pb-8 px-4">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </QuizProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

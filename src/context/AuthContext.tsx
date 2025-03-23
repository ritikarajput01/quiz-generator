
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../services/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in with Google!');
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  const signInWithGithub = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast.success('Successfully signed in with GitHub!');
    } catch (error) {
      console.error('GitHub sign in error:', error);
      toast.error('Failed to sign in with GitHub. Please try again.');
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

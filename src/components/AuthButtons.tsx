
import React from 'react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Github, Mail } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const AuthButtons: React.FC = () => {
  const { currentUser, signInWithGoogle, signInWithGithub, signOut } = useAuth();

  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || ''} />
              <AvatarFallback>{currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.displayName || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={signInWithGoogle}>
          <Mail className="mr-2 h-4 w-4" />
          Google
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signInWithGithub}>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButtons;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/auth/AuthForm';
import { GitHubButton } from '@/components/auth/GitHubButton';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const { user, initialLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialLoading && user) {
      navigate('/'); // Redirect if already logged in
    }
  }, [user, initialLoading, navigate]);

  if (initialLoading) {
    // You might want a more sophisticated loading spinner here
    return <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  // If user becomes available after initial load (e.g. OAuth redirect), this will redirect.
  // This check needs to be after initialLoading is false.
  if (user) return null;


  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-neon-green/50 selection:text-white">
      <Card className="w-full max-w-md bg-card shadow-xl shadow-neon-green/30 border border-neon-green/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold glowing-text">
            {isSignUpMode ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUpMode ? 'Enter your details to get started.' : 'Sign in to continue to your projects.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuthForm isSignUpMode={isSignUpMode} />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neon-green/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GitHubButton />
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button variant="link" onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-neon-green-lighter hover:text-neon-green">
            {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
       <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Project Requirements Collector. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthPage;

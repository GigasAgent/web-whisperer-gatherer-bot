
import { Questionnaire } from '@/components/Questionnaire';
import { UserNav } from '@/components/UserNav'; // Import UserNav
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, initialLoading } = useAuth();

  // This page is protected by ProtectedRoute, so user should exist if initialLoading is false.
  // However, having a loading state here is good practice.
  if (initialLoading) {
     return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-neon-green" />
      </div>
    );
  }
  
  // If somehow user is null after loading (should not happen due to ProtectedRoute), handle gracefully.
  if (!user) {
    // ProtectedRoute should handle redirection, but this is a fallback.
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 sm:p-8 selection:bg-neon-green/50 selection:text-white">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12 text-center">
        <div>{/* Placeholder for left side if needed */}</div>
        <div className="flex-grow text-center">
          <h1 className="text-5xl font-extrabold tracking-tight glowing-text">
            Let's Build Your Vision
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions to help us understand your project requirements.
          </p>
        </div>
        <UserNav /> {/* Add UserNav to the header */}
      </header>
      <main className="w-full flex flex-col items-center">
        <Questionnaire />
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Project Requirements Collector. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;

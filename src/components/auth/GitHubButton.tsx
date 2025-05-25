
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Github, Loader2 } from 'lucide-react'; // Assuming Github icon is available

export const GitHubButton: React.FC = () => {
  const { signInWithGitHub, loading } = useAuth();

  return (
    <Button
      variant="outline"
      className="w-full border-neon-green text-neon-green hover:bg-neon-green/10 flex items-center justify-center"
      onClick={signInWithGitHub}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Github className="mr-2 h-4 w-4" />
      )}
      Sign in with GitHub
    </Button>
  );
};

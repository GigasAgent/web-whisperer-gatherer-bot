
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError, Provider } from '@supabase/supabase-js';
import { cleanupAuthState } from '@/utils/authUtils';
import { toast } from '@/hooks/use-toast'; // Corrected import path

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
  // Add other profile fields as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setInitialLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setInitialLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth event:", _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        if (_event === 'SIGNED_IN' || _event === 'USER_UPDATED' || _event === 'TOKEN_REFRESHED') {
          // Defer profile fetching slightly to avoid race conditions with new user trigger
          setTimeout(() => fetchProfile(session.user.id), 100);
        }
      } else {
        setProfile(null);
      }
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
      }
      setLoading(false); // Ensure loading is false after auth state changes
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
        console.error('Error fetching profile:', error);
        toast({ title: "Error", description: "Could not fetch user profile.", variant: "destructive" });
        setProfile(null);
      } else {
        setProfile(data as Profile | null);
      }
    } catch (e) {
      console.error('Exception fetching profile:', e);
      toast({ title: "Error", description: "An unexpected error occurred while fetching profile.", variant: "destructive" });
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    cleanupAuthState(); // Clean state before new login attempt
    try {
      await supabase.auth.signOut({ scope: 'global' }); // Attempt global sign out
    } catch (err) { /* Ignore */ }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Sign In Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed In", description: "Successfully signed in!" });
    }
    setLoading(false);
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) { /* Ignore */ }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0], // Pass full_name to be picked up by handle_new_user trigger
        },
      },
    });
    if (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } else if (data.user) {
      toast({ title: "Sign Up Successful", description: "Please check your email to verify your account." });
    }
    setLoading(false);
    return { error };
  };

  const signInWithGitHub = async () => {
    setLoading(true);
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) { /* Ignore */ }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin, // Or your specific auth callback page if different
      },
    });
    if (error) {
      toast({ title: "GitHub Sign In Error", description: error.message, variant: "destructive" });
      setLoading(false);
    }
    // Supabase handles redirect, loading state will persist until redirect or error.
  };

  const signOut = async () => {
    setLoading(true);
    cleanupAuthState();
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      toast({ title: "Sign Out Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed Out", description: "Successfully signed out." });
      setProfile(null); // Clear profile on sign out
      setUser(null);
      setSession(null);
    }
    setLoading(false);
    // Redirect handled by ProtectedRoute or page logic
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, initialLoading, signInWithEmail, signUpWithEmail, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError, Provider, RealtimeChannel, RealtimeChannelSendResponse } from '@supabase/supabase-js';
import { cleanupAuthState } from '@/utils/authUtils';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null; user?: User | null }>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Profile {
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
    }).catch(error => {
      console.error("Error getting session:", error);
      setInitialLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth event:", _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (_event === 'SIGNED_IN' || _event === 'USER_UPDATED' || _event === 'TOKEN_REFRESHED' || _event === "PASSWORD_RECOVERY") {
           // Defer profile fetching slightly to avoid race conditions with new user trigger
          // and to ensure Supabase has fully processed the auth event.
          setTimeout(() => fetchProfile(session.user.id), 100);
        }
      } else {
        setProfile(null); // Clear profile if no user
      }

      if (_event === 'SIGNED_OUT') {
        setProfile(null); // Ensure profile is cleared on sign out
        // No need to set user/session to null here, as it's handled by onAuthStateChange
      }
      setLoading(false); // Ensure loading is false after auth state changes
    });

    return () => {
      authListener?.subscription?.unsubscribe(); // Corrected: unsubscribe from the subscription object
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
          full_name: fullName || email.split('@')[0], 
        },
      },
    });

    if (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } else if (data.user) {
      // Profile creation is handled by the trigger `on_auth_user_created`.
      // `fetchProfile` will be called by `onAuthStateChange` listener when `SIGNED_IN` event occurs.
      toast({ title: "Sign Up Successful", description: "Please check your email to verify your account." });
    }
    setLoading(false);
    return { error, user: data.user };
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
    cleanupAuthState(); // Clean local storage first
    const { error } = await supabase.auth.signOut({ scope: 'global' }); // Attempt global sign out
    
    // The onAuthStateChange listener will handle setting user, session, and profile to null.
    // So explicit null setting here is redundant and can cause race conditions.
    
    if (error) {
      toast({ title: "Sign Out Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed Out", description: "Successfully signed out." });
      // No need to explicitly set user/session/profile to null here,
      // onAuthStateChange handles it.
      // window.location.href = '/auth'; // Force redirect and clear state
    }
    setLoading(false);
    // Redirect should be handled by ProtectedRoute or page logic based on auth state.
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

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAuthLoading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, displayName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function sanitizeDisplayName(displayName: string) {
  return displayName.trim().slice(0, 80);
}

async function fetchProfile(userId: string) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from('profiles').select('id,display_name,avatar_url,created_at,updated_at').eq('id', userId).maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

async function upsertProfile(userId: string, displayName: string) {
  if (!supabase) {
    return null;
  }

  const safeDisplayName = sanitizeDisplayName(displayName);

  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      display_name: safeDisplayName || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  return error?.message ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      if (!supabase) {
        setIsAuthLoading(false);
        return;
      }

      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      setSession(initialSession);
      setProfile(initialSession?.user ? await fetchProfile(initialSession.user.id) : null);
      setIsAuthLoading(false);
    }

    loadSession();

    const subscription = supabase?.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!isActive) {
        return;
      }

      setSession(nextSession);
      setProfile(nextSession?.user ? await fetchProfile(nextSession.user.id) : null);
      setIsAuthLoading(false);
    });

    return () => {
      isActive = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isAuthLoading,
      async signIn(email, password) {
        if (!supabase) {
          return 'Supabase n’est pas configuré.';
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        return error?.message ?? null;
      },
      async signUp(email, password, displayName) {
        if (!supabase) {
          return 'Supabase n’est pas configuré.';
        }

        const safeDisplayName = sanitizeDisplayName(displayName);
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: safeDisplayName,
            },
          },
        });

        if (error) {
          return error.message;
        }

        if (data.user && data.session) {
          const profileError = await upsertProfile(data.user.id, safeDisplayName);

          if (profileError) {
            return profileError;
          }

          setProfile(await fetchProfile(data.user.id));
        }

        return null;
      },
      async signOut() {
        await supabase?.auth.signOut();
        setProfile(null);
        setSession(null);
      },
      async updateDisplayName(displayName) {
        const userId = session?.user.id;

        if (!userId) {
          return 'Connecte-toi avant de modifier ton profil.';
        }

        const error = await upsertProfile(userId, displayName);

        if (!error) {
          setProfile(await fetchProfile(userId));
        }

        return error;
      },
    }),
    [isAuthLoading, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

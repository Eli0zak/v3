import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>();

const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const limit = rateLimitMap.get(key) || { attempts: 0, lastAttempt: 0 };

  if (now - limit.lastAttempt > RATE_LIMIT_WINDOW) {
    limit.attempts = 0;
  }

  if (limit.attempts >= MAX_ATTEMPTS) {
    return false;
  }

  limit.attempts++;
  limit.lastAttempt = now;
  rateLimitMap.set(key, limit);
  return true;
};

// Auth functions
export const signIn = async (email: string, password: string) => {
  if (!checkRateLimit(email)) {
    toast({
      title: "Too many attempts",
      description: "Please wait a few minutes before trying again.",
      variant: "destructive",
    });
    return null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast({
      title: "Authentication Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  return data.user;
};

export const signUp = async (email: string, password: string) => {
  if (!checkRateLimit(email)) {
    toast({
      title: "Too many attempts",
      description: "Please wait a few minutes before trying again.",
      variant: "destructive",
    });
    return null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    toast({
      title: "Registration Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  toast({
    title: "Registration Successful",
    description: "Please check your email to confirm your account.",
  });
  return data.user;
};
export const signOut = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
};

// This function is causing conflict with getUserProfile in profiles.ts
// We'll rename it in the index.ts re-export

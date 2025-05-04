import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase';
import { UserProfile, PlanType } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  userPlan: PlanType;
  updateUserData: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<PlanType>('basic');
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateUserData = async () => {
    try {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        const profile = await getUserProfile(currentUser.id);

        if (profile) {
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: profile.full_name || '',
            plan: (profile.plan as PlanType) || 'basic',
            role: profile.role || 'user',
          });

          setUserPlan((profile.plan as PlanType) || 'basic');
          setIsAdmin(profile.role === 'admin');
        } else {
          console.warn("No profile found for user:", currentUser.id);
          setUser((prevUser) => prevUser || {
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: '',
            plan: 'basic',
          });
          setUserPlan('basic');
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setUserPlan('basic');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await updateUserData();
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setUserPlan('basic');
        setIsAdmin(false);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session && session.user) {
          await updateUserData();
        } else {
          setUser(null);
          setUserPlan('basic');
          setIsAdmin(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: loading || !authInitialized, 
      userPlan, 
      updateUserData, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };

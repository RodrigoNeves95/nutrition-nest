import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  planId?: string;
  isBlocked?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  blockUser: (userId: string, isBlocked: boolean) => Promise<boolean>;
  assignPlan: (userId: string, planId: string) => Promise<boolean>;
};

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  createUser: async () => false,
  updateUser: async () => false,
  deleteUser: async () => false,
  blockUser: async () => false,
  assignPlan: async () => false
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing session and subscribe to auth changes
  useEffect(() => {
    setLoading(true);
    
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await setUserFromSession(session);
      }
      setLoading(false);
    };
    
    initializeAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await setUserFromSession(session);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Helper function to set user data from session
  const setUserFromSession = async (session: Session) => {
    try {
      const userId = session.user.id;
      
      // Fetch user profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      // Set the user state with profile data
      setUser({
        id: userId,
        name: profile.name || session.user.email?.split('@')[0] || 'User',
        email: profile.email || session.user.email || '',
        isAdmin: profile.is_admin || false,
        planId: profile.plan_id || undefined,
        isBlocked: profile.is_blocked || false
      });
    } catch (error) {
      console.error('Error setting user from session:', error);
    }
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Create new user (admin only)
  const createUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      // Check if user has admin privileges
      if (!user?.isAdmin) {
        toast({
          title: "Permission denied",
          description: "Only admins can create new users",
          variant: "destructive",
        });
        return false;
      }
      
      // Create the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { name: userData.name }
      });
      
      if (authError) {
        toast({
          title: "User creation failed",
          description: authError.message,
          variant: "destructive",
        });
        return false;
      }
      
      // Update the profile with additional data if needed
      if (userData.isAdmin || userData.planId) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_admin: userData.isAdmin,
            plan_id: userData.planId
          })
          .eq('id', authData.user.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          // Continue anyway since the user was created
        }
      }
      
      toast({
        title: "User created successfully",
        description: `New user: ${userData.name}`,
      });
      return true;
    } catch (error: any) {
      console.error("Create user error:", error);
      toast({
        title: "Error creating user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Update user (admin only)
  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      // Check if user has admin privileges
      if (!user?.isAdmin) {
        toast({
          title: "Permission denied",
          description: "Only admins can update users",
          variant: "destructive",
        });
        return false;
      }
      
      // Update the profile with additional data
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email,
          is_admin: userData.isAdmin,
          plan_id: userData.planId
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Error updating user",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "User updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Update user error:", error);
      toast({
        title: "Error updating user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Delete user (admin only)
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Check if user has admin privileges
      if (!user?.isAdmin) {
        toast({
          title: "Permission denied",
          description: "Only admins can delete users",
          variant: "destructive",
        });
        return false;
      }
      
      // Delete the user with Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        toast({
          title: "User deletion failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "User deleted successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Delete user error:", error);
      toast({
        title: "Error deleting user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Block/unblock user (admin only)
  const blockUser = async (userId: string, isBlocked: boolean): Promise<boolean> => {
    try {
      // Check if user has admin privileges
      if (!user?.isAdmin) {
        toast({
          title: "Permission denied",
          description: "Only admins can block/unblock users",
          variant: "destructive",
        });
        return false;
      }
      
      // Update the profile with blocked status
      const { error } = await supabase
        .from('profiles')
        .update({
          is_blocked: isBlocked
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error blocking/unblocking user:', error);
        toast({
          title: isBlocked ? "Error blocking user" : "Error unblocking user",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: isBlocked ? "User blocked successfully" : "User unblocked successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Block user error:", error);
      toast({
        title: isBlocked ? "Error blocking user" : "Error unblocking user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Assign nutrition plan to user (admin only)
  const assignPlan = async (userId: string, planId: string): Promise<boolean> => {
    try {
      // Check if user has admin privileges
      if (!user?.isAdmin) {
        toast({
          title: "Permission denied",
          description: "Only admins can assign plans",
          variant: "destructive",
        });
        return false;
      }
      
      // Update the profile with plan ID
      const { error } = await supabase
        .from('profiles')
        .update({
          plan_id: planId
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error assigning plan:', error);
        toast({
          title: "Error assigning plan",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Plan assigned successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Assign plan error:", error);
      toast({
        title: "Error assigning plan",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      createUser,
      updateUser,
      deleteUser,
      blockUser,
      assignPlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

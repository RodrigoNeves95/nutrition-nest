
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from '@/components/ui/use-toast';

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  planId?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
};

// Mock data - in a real app this would be stored in a database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@nutritionnest.com",
    password: "admin123",
    isAdmin: true
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    isAdmin: false,
    planId: "plan1"
  }
];

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  createUser: async () => false
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('nutritionNestUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('nutritionNestUser');
      }
    }
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('nutritionNestUser', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutritionNestUser');
    toast({
      title: "Logged out successfully",
    });
  };
  
  // Create new user (admin only)
  const createUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        toast({
          title: "User creation failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }
      
      // In a real app, this would be a POST request to create the user
      // For now we just add to our mock data array
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        ...userData
      };
      
      MOCK_USERS.push(newUser);
      
      toast({
        title: "User created successfully",
        description: `New user: ${userData.name}`,
      });
      return true;
    } catch (error) {
      console.error("Create user error:", error);
      toast({
        title: "Error creating user",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

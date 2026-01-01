import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "general" | "alumni" | "admin";
export type UserStatus = "active" | "blocked" | "pending";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  graduationYear?: number;
  profilePhoto?: string;
  bio?: string;
  currentCompany?: string;
  jobTitle?: string;
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@auth_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to restore user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      // In production, this would call Firebase Authentication
      // For now, we'll create a mock user
      const newUser: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName,
        role: "general",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setUser(newUser);
      await AsyncStorage.setItem("@auth_user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In production, this would call Firebase Authentication
      // For now, we'll create a mock user
      const mockUser: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        role: "general",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setUser(mockUser);
      await AsyncStorage.setItem("@auth_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("@auth_user");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, role, updatedAt: Date.now() };
      setUser(updatedUser);
      await AsyncStorage.setItem("@auth_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update user role:", error);
      throw error;
    }
  };

  const updateUserProfile = async (profile: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...profile, updatedAt: Date.now() };
      setUser(updatedUser);
      await AsyncStorage.setItem("@auth_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: !!user,
        signUp,
        login,
        logout,
        updateUserRole,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

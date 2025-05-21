
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { DatabaseCredentials, getDatabaseConfig } from "@/utils/databaseUtils";

export type UserRole = "owner" | "admin" | "editor";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  dbConfig: DatabaseCredentials | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: {
    username: string;
    password: string;
    email: string;
    role: UserRole;
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConfig, setDbConfig] = useState<DatabaseCredentials | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    const config = getDatabaseConfig();
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    
    setDbConfig(config);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const config = getDatabaseConfig();
      if (!config) {
        toast.error("Database configuration not found");
        return false;
      }

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentials: config,
          username,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const userData = await response.json();
      setUser(userData.user);
      localStorage.setItem("user", JSON.stringify(userData.user));
      toast.success("Login successful");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const createUser = async (userData: {
    username: string;
    password: string;
    email: string;
    role: UserRole;
  }): Promise<boolean> => {
    try {
      const config = getDatabaseConfig();
      if (!config) {
        toast.error("Database configuration not found");
        return false;
      }

      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentials: config,
          user: userData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "User creation failed");
      }

      toast.success(`User ${userData.username} created successfully`);
      return true;
    } catch (error: any) {
      console.error("User creation error:", error);
      toast.error(error.message || "Failed to create user");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        dbConfig,
        login,
        logout,
        createUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

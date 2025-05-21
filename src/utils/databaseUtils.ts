
// Database check and connection utilities
import { toast } from "@/components/ui/sonner";

// Types
export interface DatabaseCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database?: string;
}

// Check if MySQL is installed on the system
export const checkMySQLInstalled = async (): Promise<boolean> => {
  try {
    // In a real browser environment, we can't directly check if MySQL is installed
    // We'll check by attempting to connect to a test endpoint
    const response = await fetch('/api/check-mysql-installed', { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('MySQL installation check failed');
    }
    
    const data = await response.json();
    return data.installed;
  } catch (error) {
    console.error('Error checking MySQL installation:', error);
    return false;
  }
};

// Check if MySQL server is running
export const checkMySQLRunning = async (): Promise<boolean> => {
  try {
    // In a browser environment, we would check this through a backend API
    const response = await fetch('/api/check-mysql-running', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('MySQL running check failed');
    }
    
    const data = await response.json();
    return data.running;
  } catch (error) {
    console.error('Error checking if MySQL is running:', error);
    return false;
  }
};

// Test database connection with credentials
export const testDatabaseConnection = async (credentials: DatabaseCredentials): Promise<boolean> => {
  try {
    const response = await fetch('/api/test-db-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Database connection failed');
    }

    return true;
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    toast.error(error.message || "Failed to connect to database");
    return false;
  }
};

// Create database if it doesn't exist
export const createDatabase = async (credentials: DatabaseCredentials): Promise<boolean> => {
  try {
    const response = await fetch('/api/create-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create database');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating database:', error);
    toast.error(error.message || "Failed to create database");
    return false;
  }
};

// Create tables for user management
export const setupDatabaseSchema = async (credentials: DatabaseCredentials): Promise<boolean> => {
  try {
    const response = await fetch('/api/setup-schema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to setup database schema');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error setting up database schema:', error);
    toast.error(error.message || "Failed to setup database schema");
    return false;
  }
};

// Create owner user
export const createOwnerUser = async (credentials: DatabaseCredentials, ownerUser: {
  username: string;
  password: string;
  email: string;
}): Promise<boolean> => {
  try {
    const response = await fetch('/api/create-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentials,
        ownerUser
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create owner user');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating owner user:', error);
    toast.error(error.message || "Failed to create owner user");
    return false;
  }
};

// Import data from SQL file
export const importDataFromSQL = async (credentials: DatabaseCredentials, sqlFile: File): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('sqlFile', sqlFile);
    formData.append('credentials', JSON.stringify(credentials));
    
    const response = await fetch('/api/import-sql', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to import SQL data');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error importing SQL data:', error);
    toast.error(error.message || "Failed to import SQL data");
    return false;
  }
};

// Check if database configuration exists in local storage
export const getDatabaseConfig = (): DatabaseCredentials | null => {
  const configString = localStorage.getItem('dbConfig');
  if (!configString) return null;
  
  try {
    return JSON.parse(configString);
  } catch (error) {
    console.error('Error parsing database config:', error);
    return null;
  }
};

// Save database configuration
export const saveDatabaseConfig = (config: DatabaseCredentials): void => {
  localStorage.setItem('dbConfig', JSON.stringify(config));
};

// Remove database configuration
export const clearDatabaseConfig = (): void => {
  localStorage.removeItem('dbConfig');
};

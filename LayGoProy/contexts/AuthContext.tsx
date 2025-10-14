import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { seedTestUsers } from '../data/seedUsers';
import { UserStorage } from '../data/userStorage';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  biometricLogin: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Helper functions para manejar almacenamiento seguro en web y móvil
const setSecureItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    // En web, usar localStorage con prefijo
    localStorage.setItem(`secure_${key}`, value);
  } else {
    // En móvil, usar SecureStore
    await SecureStore.setItemAsync(key, value);
  }
};

const getSecureItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    // En web, usar localStorage con prefijo
    return localStorage.getItem(`secure_${key}`);
  } else {
    // En móvil, usar SecureStore
    return await SecureStore.getItemAsync(key);
  }
};

const deleteSecureItem = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    // En web, usar localStorage con prefijo
    localStorage.removeItem(`secure_${key}`);
  } else {
    // En móvil, usar SecureStore
    await SecureStore.deleteItemAsync(key);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Crear usuarios de prueba si no existen
      await seedTestUsers();
      
      // Verificar estado de autenticación
      await checkAuthState();
    } catch (error) {
      console.error('Error initializing auth:', error);
      setIsLoading(false);
    }
  };

  const checkAuthState = async () => {
    try {
      const token = await getSecureItem('authToken');
      const currentUser = await UserStorage.getCurrentUser();
      
      if (token && currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validar credenciales usando el sistema de almacenamiento
      const storedUser = await UserStorage.validateCredentials(email, password);
      
      if (storedUser) {
        const token = 'mock-jwt-token-' + Date.now();
        
        await setSecureItem('authToken', token);
        await UserStorage.setCurrentUser(storedUser);
        setUser(storedUser);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Registrar usuario usando el sistema de almacenamiento
      const newUser = await UserStorage.registerUser({
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        password: userData.password, // En producción, encriptar aquí
        profileImage: userData.profileImage,
        preferences: userData.preferences || {
          notifications: true,
          theme: 'auto'
        }
      });
      
      // NO hacer auto-login, solo registrar
      console.log('Usuario registrado exitosamente:', newUser.email);
      
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await deleteSecureItem('authToken');
      await UserStorage.clearCurrentUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = await UserStorage.updateUser(user.id, userData);
      if (updatedUser) {
        await UserStorage.setCurrentUser(updatedUser);
        setUser(updatedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const biometricLogin = async (): Promise<boolean> => {
    try {
      // En web, la autenticación biométrica no está disponible
      if (Platform.OS === 'web') {
        return false;
      }
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        return false;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación biométrica',
        fallbackLabel: 'Usar contraseña',
      });
      
      if (result.success) {
        // Simular login automático con biometría
        return await login('admin@test.com', '123456');
      }
      
      return false;
    } catch (error) {
      console.error('Biometric login error:', error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulación de recuperación de contraseña
      console.log('Enviando email de recuperación a:', email);
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Simulación de cambio de contraseña
      console.log('Cambiando contraseña...');
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    biometricLogin,
    forgotPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

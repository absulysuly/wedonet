import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
    login as apiLogin,
    register as apiRegister,
    loginWithGoogle as apiLoginWithGoogle, 
    loginWithFacebook as apiLoginWithFacebook,
    updateUserRole as apiUpdateUserRole
} from '../services/api';
import type { User } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    isRoleSelectionNeeded: boolean;
    user: User | null;
    isLoading: boolean;
    logout: () => void;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    updateUser: (updatedData: Partial<User>) => void;
    selectUserRole: (role: 'client' | 'freelancer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'wedonet-auth-user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isRoleSelectionNeeded, setIsRoleSelectionNeeded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                // Ensure `isNew` flag doesn't persist incorrectly after a refresh
                if (parsedUser.isNew) {
                    setIsRoleSelectionNeeded(true);
                }
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            } else {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }
    }, [user, isLoading]);
    
    const loginWithEmail = async (email: string, password: string) => {
        const { user: loggedInUser } = await apiLogin(email, password);
        setUser(loggedInUser);
        setIsRoleSelectionNeeded(false);
    };
    
    const registerWithEmail = async (name: string, email: string, password: string) => {
        const { user: newUser } = await apiRegister(name, email, password);
        setUser(newUser);
        setIsRoleSelectionNeeded(true);
    };

    const handleSocialLogin = async (loginFn: () => Promise<{ user: User }>) => {
        const { user: socialUser } = await loginFn();
        setUser(socialUser);
        if (socialUser.isNew) {
            setIsRoleSelectionNeeded(true);
        }
    };

    const loginWithGoogle = () => handleSocialLogin(apiLoginWithGoogle);
    const loginWithFacebook = () => handleSocialLogin(apiLoginWithFacebook);

    const logout = () => {
        setUser(null);
        setIsRoleSelectionNeeded(false);
    };

    const updateUser = (updatedData: Partial<User>) => {
        setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
    };
    
    const selectUserRole = async (role: 'client' | 'freelancer') => {
        if (user) {
            const updatedUser = await apiUpdateUserRole(user.id, role);
            // After role is selected, isNew should be false
            setUser({ ...updatedUser, isNew: false });
            setIsRoleSelectionNeeded(false);
        }
    };

    const value = {
        isAuthenticated: !!user,
        isRoleSelectionNeeded,
        user,
        isLoading,
        logout,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        updateUser,
        selectUserRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

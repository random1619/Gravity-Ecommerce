'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('gravity-user');
        if (savedUser) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse user from localStorage', error);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            if (user) {
                localStorage.setItem('gravity-user', JSON.stringify(user));
            } else {
                localStorage.removeItem('gravity-user');
            }
        }
    }, [user, isInitialized]);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }

        // Mock authentication - in production, this would call an API
        // with proper password hashing and JWT tokens
        if (email && password.length >= 6) {
            const name = email.split('@')[0];
            setUser({ name, email });
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // Mock registration - in production, this would call an API
        if (name && email && password.length >= 6) {
            setUser({ name, email });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

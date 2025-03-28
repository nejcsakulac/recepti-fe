import { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthProviderPropsType from '../types/AuthProviderPropsType';
import AuthContextType from '../types/AuthContextType';

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    jwtToken: null,
    loading: true,
    login: () => {},
    logout: () => {}
});

export function AuthProvider({ children }: AuthProviderPropsType) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    function login(token: string) {
        setIsAuthenticated(true);
        setJwtToken(token);
        localStorage.setItem("token", token);
    }

    function logout() {
        setIsAuthenticated(false);
        setJwtToken(null);
        localStorage.removeItem("token");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            setJwtToken(token);
        }
        setLoading(false); // Set loading to false after checking localStorage
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, jwtToken, loading, login, logout }}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

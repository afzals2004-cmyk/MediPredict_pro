import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Memoize fetchUser to prevent recreation on every render
    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            // Don't call logout here to avoid circular dependencies
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies needed

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
        }
    }, [token, fetchUser]);

    const login = useCallback(async (email, password) => {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        try {
            const response = await api.post('/auth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const newToken = response.data.access_token;

            // Set header immediately
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            // Fetch user data before updating token state
            const userResponse = await api.get('/auth/me');

            // Update all state at once to prevent multiple re-renders
            setUser(userResponse.data);
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setLoading(false);

            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    }, []);

    const register = useCallback(async (fullName, email, password) => {
        try {
            await api.post('/auth/register', {
                full_name: fullName,
                email: email,
                password: password
            });
            return await login(email, password);
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    }, [login]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        token,
        login,
        register,
        logout,
        loading
    }), [user, token, login, register, logout, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

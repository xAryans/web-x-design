import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (token && role) {
                try {
                    let res;
                    if (role === 'patient') {
                        res = await api.get('/patient/profile');
                    } else if (role === 'doctor') {
                        res = await api.get('/doctor/profile');
                    }
                    if (res) setUser({ ...res.data, role });
                } catch (err) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    console.error(err);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = (userData, token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setUser({ ...userData, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

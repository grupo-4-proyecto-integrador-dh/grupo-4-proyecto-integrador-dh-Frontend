import React, { createContext, useContext, useReducer } from 'react';
import authReducer, { initialState, setToken, setUser, removeToken, removeUser } from '../Reducers/authReducer';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch, setToken, setUser, removeToken, removeUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
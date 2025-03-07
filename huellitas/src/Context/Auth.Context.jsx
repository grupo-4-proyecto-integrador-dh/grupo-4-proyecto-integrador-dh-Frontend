import React, { createContext, useContext, useReducer, useEffect } from "react";
import authReducer, { initialState, setToken, setUser, removeToken, removeUser, setRol } from "../Reducers/authReducer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const storedRol = localStorage.getItem("rol");
      
        if (storedToken && storedUser) {
          dispatch(setToken(storedToken));
          dispatch(setUser({ ...JSON.parse(storedUser), rol: storedRol }));
        }
      }, [dispatch]);
      ;

    return (
        <AuthContext.Provider value={{ state, dispatch, setToken, setUser, removeToken, removeUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

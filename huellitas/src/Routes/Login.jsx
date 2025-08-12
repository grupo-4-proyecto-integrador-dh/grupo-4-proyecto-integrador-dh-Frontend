import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Styles/Login.css";
import axios from "axios";
import { useAuth } from "../Context/Auth.Context";
import { setToken, setUser, setRol } from "../Reducers/authReducer"



const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/auth/login";
const USER_INFO_URL = import.meta.env.VITE_BACKEND_URL + "/usuarios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [inicioExitoso, setInicioExitoso] = useState("")
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromReservation = queryParams.get('from') === 'reservation';
    const from = location.state?.from?.pathname || '/'


    const handleRedirect = () => {
        navigate('/registro?from=reservation'); // Redirige a la página de registro
      };



    useEffect(() => {
        if (fromReservation) {
          console.log('Redirigido desde la reserva');
        }
      }, [fromReservation]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email, 
                    contrasena: password
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.jwt && data.usuario) {
                const { id } = data.usuario;
                
                // Set token first
                dispatch(setToken(data.jwt));
                
                // Fetch complete user info including role
                const userInfoResponse = await fetch(`${USER_INFO_URL}/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${data.jwt}`
                    }
                });
                
                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();
                    
                    // Update user state with complete info including role
                    dispatch(setUser(userInfo));
                    dispatch(setRol(userInfo.rol));
                    
                    setInicioExitoso("Inicio de sesión exitoso");
                    
                    if (userInfo.rol === "ADMIN") {
                        navigate("/administracion");
                    } else {
                        navigate(fromReservation ? from : "/");
                    }
                }
            } else {
                setError("Credenciales inválidas");
            }
        } catch (error) {
            setError("Error al iniciar sesión");
            console.error("Error:", error);
        }
    };

    return (
        <div className="login-container">
            
            <div className="login-box">
                {fromReservation && (
                    <div className="alert alert-success" role="alert">
                            <p>
                             Es obligatorio el inicio de sesíon para poder reservar, si aun no tienes cuenta puedes registrarte {' '}
                              <span 
                                onClick={handleRedirect} 
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                    aquí.
                              </span>
                            </p>
                    </div>
                )}
                <h2>Iniciar Sesión</h2>

                {error && (
                    <div className="error-message">
                        <span>⚠️ {error}</span>
                        <br />
                        <Link to="/Registro" className="register-link">Regístrate aquí</Link>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Ingresa tu correo"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label htmlFor="rememberMe">Recordarme</label>
                    </div>
                    <button type="submit" className="login-button">Iniciar Sesión</button>
                    {inicioExitoso && (<div className="alert alert-success" role="alert">
                         ✅ Inicio de sesíon exitoso. Redirigiendo...
                    </div>)} 
                </form>

                <div className="extra-links">
                    <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
                </div>
            </div>
        </div>
    );



    
};

export default Login;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Simulación de usuarios 
      const fakeUsers = [
        { name: "Andres", lastName: "Pérez", email: "andres@example.com", password: "123456" },
        { name: "Ana", lastName: "García", email: "ana@example.com", password: "654321" },
      ];

      const user = fakeUsers.find((u) => u.email === email && u.password === password);

      if (user) {
        console.log("Inicio de sesión exitoso", user);
        localStorage.setItem("user", JSON.stringify(user)); // Guardar en localStorage
        window.dispatchEvent(new Event("storage")); //  cambio global
        navigate("/");
      } else {
        setError("Correo o contraseña incorrectos. Verifica tus datos.");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setError("Hubo un problema al conectar con el servidor. Intenta de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        {/* Mensaje de error  */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <br />
            <Link to="/register" className="register-link">Regístrate aquí</Link>
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
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
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
        </form>

        <div className="extra-links">
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


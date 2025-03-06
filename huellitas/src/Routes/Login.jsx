import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css";

const API_URL = "http://localhost:8081/api/auth/login";

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
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena: password }),
      });

      if (!response.ok) {
        throw new Error("Correo o contraseña incorrectos.");
      }

      const data = await response.json();
      console.log("Datos del backend:", data);

      // Guardar el token y la información del usuario
      if (data.jwt) {
        if (rememberMe) {
          localStorage.setItem("token", data.jwt); // Guardar el token
        } else {
          sessionStorage.setItem("token", data.jwt); // Guardar el token en sessionStorage
        }

        // Guardar la información del usuario
        const user = {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email
        };
        localStorage.setItem("user", JSON.stringify(user)); // Guardar el nombre y apellido del usuario
      }

      console.log("Inicio de sesión exitoso", data);
      window.dispatchEvent(new Event("storage")); // Notificar el cambio global
      navigate("/"); // Redirigir a la página principal

    } catch (err) {
      console.error("Error en la autenticación:", err);
      setError("Correo o contraseña incorrectos. Verifica tus datos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        {/* Mensaje de error */}
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
        </form>

        <div className="extra-links">
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;



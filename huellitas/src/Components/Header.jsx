import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "/media/svg/logo-svg.svg";
import "../Styles/Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <Link className="brand-link" to="/">
            <img src={logo} alt="Huellitas Logo" className="logo-img" />
            <span className="nav-text">Un hogar para tu mascota</span>
          </Link>
        </div>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <div className="auth-buttons">
            <button
              className="crear-cuenta-button"
              onClick={() => {
                console.log("Redirigiendo a /registro...");
                navigate("/registro");
              }}
            >
              Crear Cuenta
            </button>
            <button className="btn">Iniciar Sesión</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

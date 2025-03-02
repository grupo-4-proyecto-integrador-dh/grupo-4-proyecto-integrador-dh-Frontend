import "../Styles/Header.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "/media/svg/logo-svg.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <button className="btn">Crear Cuenta</button>
            <button className="btn">Iniciar Sesión</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

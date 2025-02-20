import "../Styles/Header.css";
import { Link } from "react-router-dom";
import logo from "../logo-example_1 1 (1).ico";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="logo" to="/">
          <img src={logo} alt="Huellitas Logo" className="logo-img" />
        </Link>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/" className="nav-text">Un hogar para tu mascota</Link>
            </li>
          </ul>
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

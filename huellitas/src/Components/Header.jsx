import "../Styles/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "/media/svg/logo-svg.svg";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Función para obtener el usuario desde localStorage
  const fetchUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    fetchUser();

    const handleStorageChange = () => {
      fetchUser(); // Actualizar usuario cuando hay cambios en localStorage
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userLoggedIn");
    window.dispatchEvent(new Event("storage")); // Notificar cambios globales
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <Link className="brand-link" to="/">
            <img src={logo} alt="Huellitas Logo" className="logo-img" />
            <span className="nav-text">Un hogar para tu mascota</span>
          </Link>
        </div>

        {/* Botón del menú responsive */}
        <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </button>

        {/* Contenedor de enlaces y usuario */}
        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>        
           {user ? (
            <div className="user-info">
              <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
                {user.name ? user.name.charAt(0).toUpperCase() : ""}
                {user.lastName ? user.lastName.charAt(0).toUpperCase() : ""}
              </div>
              {menuOpen && (
                <div className="user-menu">
                  <p>{user.name} {user.lastName}</p>
                  <p>{user.email}</p>
                  <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              )}
            </div>
          ) : (
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
              <Link to="/login" className="btn">Iniciar Sesión</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

import "../Styles/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import logo from "/media/svg/logo-svg.svg";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    // Primero actualizar el estado de la aplicación
    setUser(null);
    setMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    try {
      // Limpiar datos de sesión del usuario
      localStorage.removeItem("user");
      localStorage.removeItem("rol");
      localStorage.removeItem("token");
      
      // Limpiar favoritos en sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('favorito_')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Notificar cambios a otros componentes
      window.dispatchEvent(new Event("storage"));
      
      // Navegar a la página principal y refrescar
      navigate("/", { replace: true });
      window.location.reload();
      
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, inténtelo de nuevo.");
    }
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const storedRol = localStorage.getItem("rol");
      const token = localStorage.getItem("token");
  
      if (!storedUser || !storedRol || !token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
  
      const userData = JSON.parse(storedUser);
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/usuarios/${userData.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expirado o inválido, cerrar sesión
          handleLogout();
          return;
        }
        throw new Error("Error al obtener usuario");
      }
  
      const data = await response.json();
      setUser({ ...data, rol: storedRol });
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); 
  
  // Modify the useEffect that handles storage events
  useEffect(() => {
    const handleLoginSuccess = () => {
      fetchUser();
    };

    const handleStorageChange = (event) => {
      // Only react to relevant storage changes
      if (event.key === 'user' || event.key === 'token') {
        fetchUser();
      }
    };
    
    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check for existing session
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      fetchUser();
    }
    
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchUser]);
  
  const handleProfileClick = () => {
    navigate("/perfil");
    setMenuOpen(false);
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
          {isLoading ? (
            <div className="loading-avatar"></div>
          ) : user ? (
            <div className="user-info" ref={menuRef}>
              <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : ""}
                {user.apellido ? user.apellido.charAt(0).toUpperCase() : ""}
              </div>
              {menuOpen && (
                <div className="user-menu">
                  <p>{user.nombre} {user.apellido}</p>
                  <p>{user.email}</p>
                  <button className="profile-btn" onClick={handleProfileClick}>Mi Perfil</button>
                  <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="crear-cuenta-button"
                onClick={() => navigate("/registro")}
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
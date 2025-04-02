import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/PerfilUsuario.scss";
import Swal from "sweetalert2";
import FavoritosService from "../Services/FavoritosService";

// Importar componentes modulares
import PerfilTab from "../Components/PerfilUsuario/PerfilTab";
import ReservasTab from "../Components/PerfilUsuario/ReservasTab";
import MascotasTab from "../Components/PerfilUsuario/MascotasTab";
import FavoritosTab from "../Components/PerfilUsuario/FavoritosTab";
import LoadingError from "../Components/PerfilUsuario/LoadingError";

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState("perfil");
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [cargandoReservas, setCargandoReservas] = useState(true);
  const [cargandoMascotas, setCargandoMascotas] = useState(true);
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true);
  const [errorUsuario, setErrorUsuario] = useState(null);
  const [errorReservas, setErrorReservas] = useState(null);
  const [errorMascotas, setErrorMascotas] = useState(null);
  const [errorFavoritos, setErrorFavoritos] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const url_base = import.meta.env.VITE_BACKEND_URL;

  // Verificar autenticación y cargar datos básicos del usuario
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      Swal.fire({
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder a tu perfil",
        icon: "warning",
        confirmButtonText: "Iniciar sesión"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setToken(storedToken);
      setUserId(userData.id);
      setUsuario(userData);
      
      // Una vez que tenemos los datos básicos, cargar los datos completos del cliente
      obtenerDatosCliente(userData.id, storedToken);
    } catch (error) {
      console.error("Error al procesar los datos del usuario:", error);
      setErrorUsuario("No se pudo cargar la información del usuario");
      setCargandoUsuario(false);
    }
  }, [navigate]);

  // Obtener datos completos del perfil del usuario
  const obtenerDatosCliente = async (id, token) => {
    setCargandoUsuario(true);
    try {
      // Usar el endpoint completo de perfil con el ID del usuario
      const response = await axios.get(`https://rare-compassion-production.up.railway.app/perfil/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Datos completos del perfil:", response.data);
      
      // Actualizar el usuario con los datos completos
      setUsuario(response.data);
      
      setCargandoUsuario(false);
    } catch (error) {
      console.error("Error al obtener datos del perfil:", error);
      
      if (error.response && error.response.status === 403) {
        // Si hay un error de autorización (token expirado)
        Swal.fire({
          title: "Sesión expirada",
          text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          icon: "warning",
          confirmButtonText: "Iniciar sesión"
        }).then(() => {
          // Limpiar el localStorage y redirigir al login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        });
      } else {
        setErrorUsuario("No se pudieron cargar los datos completos del usuario");
      }
      
      setCargandoUsuario(false);
    }
  };

  // Obtener reservas del usuario
  useEffect(() => {
    if (!token || !userId) return;

    const obtenerReservas = async () => {
      setCargandoReservas(true);
      setErrorReservas(null);
      
      try {
        const response = await axios.get(`${url_base}/reservas/cliente/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Respuesta de reservas:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setReservas(response.data);
        } else if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.content)) {
            setReservas(response.data.content);
          } else if (Array.isArray(response.data.reservas)) {
            setReservas(response.data.reservas);
          } else {
            setReservas([]);
          }
        } else {
          setReservas([]);
        }
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
        setErrorReservas("No se pudieron cargar tus reservas. Intenta nuevamente más tarde.");
        
        try {
          const altResponse = await axios.get(`${url_base}/reservas`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log("Respuesta alternativa de reservas:", altResponse.data);
          
          if (altResponse.data && Array.isArray(altResponse.data)) {
            const reservasUsuario = altResponse.data.filter(
              reserva => reserva.clienteEmail === usuario.email || 
                         (reserva.cliente && reserva.cliente.id === userId)
            );
            setReservas(reservasUsuario);
            setErrorReservas(null);
          }
        } catch (altError) {
          console.error("Error en la segunda petición de reservas:", altError);
        }
      } finally {
        setCargandoReservas(false);
      }
    };
    
    obtenerReservas();
  }, [token, userId, usuario, url_base]);

  // Obtener mascotas del usuario
  useEffect(() => {
    if (!token || !userId) return;

    const obtenerMascotas = async () => {
      setCargandoMascotas(true);
      setErrorMascotas(null);
      
      try {
        const response = await axios.get(`${url_base}/api/mascotas/cliente/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log("Respuesta de mascotas:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setMascotas(response.data);
        } else if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.content)) {
            setMascotas(response.data.content);
          } else if (Array.isArray(response.data.mascotas)) {
            setMascotas(response.data.mascotas);
          } else {
            setMascotas([]);
            setErrorMascotas("No se encontraron mascotas registradas.");
          }
        } else {
          setMascotas([]);
          setErrorMascotas("No se encontraron mascotas registradas.");
        }
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
        setErrorMascotas("No se pudieron cargar tus mascotas. Verifica la conexión con el servidor.");
      } finally {
        setCargandoMascotas(false);
      }
    };
    
    obtenerMascotas();
  }, [token, userId, url_base]);

  // Obtener favoritos del usuario
  useEffect(() => {
    if (token && userId) {
      obtenerFavoritos();
    }
  }, [token, userId]);

  const obtenerFavoritos = async () => {
    setCargandoFavoritos(true);
    setErrorFavoritos(null);
    
    try {
      const favoritosData = await FavoritosService.obtenerFavoritos(userId);
      
      if (Array.isArray(favoritosData)) {
        setFavoritos(favoritosData);
      } else {
        console.warn("La respuesta de favoritos no es un array:", favoritosData);
        setFavoritos([]);
      }
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      setErrorFavoritos("No se pudieron cargar tus alojamientos favoritos");
    } finally {
      setCargandoFavoritos(false);
    }
  };

  // Función para actualizar el usuario después de editar el perfil
  const actualizarUsuario = (datosActualizados) => {
    setUsuario(datosActualizados);
    // Guardar los datos actualizados en localStorage
    localStorage.setItem("user", JSON.stringify(datosActualizados));
  };

  // Función para actualizar las reservas después de cancelar una
  const actualizarReservas = (reservasActualizadas) => {
    setReservas(reservasActualizadas);
  };

  // Función para actualizar las mascotas después de editar una
  const actualizarMascotas = (mascotasActualizadas) => {
    setMascotas(mascotasActualizadas);
  };

  // Función para actualizar los favoritos después de eliminar uno
  const actualizarFavoritos = (favoritosActualizados) => {
    setFavoritos(favoritosActualizados);
  };

  // Renderizar el contenido de la pestaña activa
  const renderTabContent = () => {
    switch (tabActiva) {
      case "perfil":
        return (
          <LoadingError isLoading={cargandoUsuario} error={errorUsuario}>
            <PerfilTab 
              usuario={usuario} 
              token={token} 
              userId={userId} 
              url_base={url_base} 
              actualizarUsuario={actualizarUsuario} 
            />
          </LoadingError>
        );
      
      case "reservas":
        return (
          <LoadingError isLoading={cargandoReservas} error={errorReservas}>
            <ReservasTab 
              reservas={reservas} 
              userId={userId}
              token={token}
              url_base={url_base}
              actualizarReservas={actualizarReservas}
            />
          </LoadingError>
        );
      
      case "mascotas":
        return (
          <LoadingError isLoading={cargandoMascotas} error={errorMascotas}>
            <MascotasTab 
              mascotas={mascotas}
              userId={userId}
              token={token}
              url_base={url_base}
              actualizarMascotas={actualizarMascotas}
            />
          </LoadingError>
        );
      
      case "favoritos":
        return (
          <LoadingError isLoading={cargandoFavoritos} error={errorFavoritos}>
            <FavoritosTab 
              favoritos={favoritos}
              userId={userId}
              actualizarFavoritos={actualizarFavoritos}
            />
          </LoadingError>
        );
      
      default:
        return <div>Seleccione una pestaña</div>;
    }
  };

  return (
    <div className="perfil-usuario-container">
      <h1>Mi Perfil</h1>
      
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${tabActiva === "perfil" ? "active" : ""}`} 
            onClick={() => setTabActiva("perfil")}
          >
            Datos Personales
          </button>
          <button 
            className={`tab-btn ${tabActiva === "reservas" ? "active" : ""}`} 
            onClick={() => setTabActiva("reservas")}
          >
            Mis Reservas
          </button>
          <button 
            className={`tab-btn ${tabActiva === "mascotas" ? "active" : ""}`} 
            onClick={() => setTabActiva("mascotas")}
          >
            Mis Mascotas
          </button>
          <button 
            className={`tab-btn ${tabActiva === "favoritos" ? "active" : ""}`} 
            onClick={() => setTabActiva("favoritos")}
          >
            Favoritos
          </button>
        </div>
        
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;

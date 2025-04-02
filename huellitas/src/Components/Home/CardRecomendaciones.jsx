import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import FavoritosService from "../../Services/FavoritosService";
import Swal from "sweetalert2";

const FAVORITO_CHANGED_EVENT = 'favoritoChanged';

const CardRecomendaciones = ({ id, title, description, imagenes, price, alojamiento }) => {
  const navigate = useNavigate();
  const [esFavorito, setEsFavorito] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const comprobarEstadoFavorito = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const userData = JSON.parse(storedUser);
      const estadoGuardado = sessionStorage.getItem(`favorito_${userData.id}_${id}`);
      
      if (estadoGuardado !== null) {
        setEsFavorito(JSON.parse(estadoGuardado));
      } else if (userId) {
        verificarFavorito(userData.id, id);
      }
    } catch (error) {
      console.error("Error al comprobar estado de favorito:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUserId(userData.id);
        setIsAuthenticated(true);
        
        comprobarEstadoFavorito();
      } catch (error) {
        console.error("Error al procesar datos del usuario:", error);
      }
    }
  }, [id]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('favorito_') && e.key.endsWith(`_${id}`)) {
        comprobarEstadoFavorito();
      }
    };

    const handleFavoritoChange = (e) => {
      if (e.detail && e.detail.alojamientoId === id) {
        setEsFavorito(e.detail.esFavorito);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(FAVORITO_CHANGED_EVENT, handleFavoritoChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(FAVORITO_CHANGED_EVENT, handleFavoritoChange);
    };
  }, [id]);

  const verificarFavorito = async (clienteId, alojamientoId) => {
    try {
      await FavoritosService.esFavorito(clienteId, alojamientoId);
    } catch (error) {
      console.error("Error al verificar favorito:", error);
    }
  };

  const handleFavoritoClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para añadir favoritos",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      if (esFavorito) {
        await FavoritosService.eliminarFavorito(userId, id);
      } else {
        await FavoritosService.agregarFavorito(userId, id);
      }
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: !esFavorito
          ? "¡Añadido a favoritos!" 
          : "Eliminado de favoritos",
        showConfirmButton: false,
        timer: 1500,
        toast: true
      });
    } catch (error) {
      console.error("Error al modificar favorito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar favoritos",
        timer: 2000
      });
    }
  };

  const handleCardClick = () => {
    navigate(`/alojamiento/${id}`, { state: alojamiento });
  };

  return (
    <div className="card__recomendaciones">
      {imagenes ? (
        <img
          loading="lazy"
          src={imagenes.length > 0 ? imagenes[0].urlImagen : "/ruta/imagen-por-defecto.jpg"}
          alt={title}
          className="card__image"
        />
      ) : (
        <img
          loading="lazy"
          src="/placeholder.jpg"
          alt="Placeholder"
          className="card__image card__image--placeholder"
        />
      )}
      <div className="card__content">
        <div className="card__header">
          <h3 className="card__title">{title}</h3>
          <button 
            className={`favorito-btn ${esFavorito ? 'active' : ''}`} 
            onClick={handleFavoritoClick}
            aria-label={esFavorito ? "Eliminar de favoritos" : "Añadir a favoritos"}
          >
            {esFavorito ? <FaHeart color="#e76f51" /> : <FaRegHeart />}
          </button>
        </div>
        <p className="card__description">{description}</p>
        <div className="card__price-details">
          <span className="card__price">${price}</span>
          <button className="card__details-button" onClick={handleCardClick}>
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

CardRecomendaciones.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imagenes: PropTypes.array,
  alojamiento: PropTypes.object,
};

export default CardRecomendaciones;
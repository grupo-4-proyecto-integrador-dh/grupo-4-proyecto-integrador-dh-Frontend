import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaHeart } from "react-icons/fa";
import PropTypes from 'prop-types';
import FavoritosService from "../../Services/FavoritosService";

const FavoritosTab = ({ favoritos, userId, actualizarFavoritos }) => {
  const navigate = useNavigate();

  const eliminarFavorito = async (alojamientoId) => {
    try {
      await FavoritosService.eliminarFavorito(userId, alojamientoId);
      const favoritosActualizados = favoritos.filter(fav => fav.id !== alojamientoId);
      actualizarFavoritos(favoritosActualizados);
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Eliminado de favoritos",
        showConfirmButton: false,
        timer: 1500,
        toast: true
      });
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar de favoritos",
        timer: 2000
      });
    }
  };

  const irAlDetalle = (alojamiento) => {
    navigate(`/alojamiento/${alojamiento.id}`, { state: alojamiento });
  };

  const obtenerUrlImagen = (favorito) => {
    if (favorito.imagenesUrl && Array.isArray(favorito.imagenesUrl) && favorito.imagenesUrl.length > 0) {
      return favorito.imagenesUrl[0];
    }
    
    if (favorito.imagenes && Array.isArray(favorito.imagenes) && favorito.imagenes.length > 0) {
      if (favorito.imagenes[0].urlImagen) {
        return favorito.imagenes[0].urlImagen;
      }
      if (typeof favorito.imagenes[0] === 'string') {
        return favorito.imagenes[0];
      }
    }
    
    if (favorito.imagen) {
      return favorito.imagen;
    }
    
    return "https://via.placeholder.com/300x200?text=Sin+Imagen";
  };

  return (
    <div className="favoritos-tab">
      <h2>Mis Alojamientos Favoritos</h2>
      {favoritos.length === 0 ? (
        <div className="empty-state">
          <p>No tienes alojamientos favoritos.</p>
          <button 
            className="action-btn"
            onClick={() => navigate("/")}
          >
            Explorar alojamientos
          </button>
        </div>
      ) : (
        <div className="favoritos-grid">
          {favoritos.map((favorito) => (
            <div key={favorito.id} className="favorito-card">
              <div className="favorito-img-container">
                <img 
                  src={obtenerUrlImagen(favorito)}
                  alt={favorito.nombre || "Alojamiento"} 
                  className="favorito-img"
                  onClick={() => irAlDetalle(favorito)}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
                    e.target.onerror = null; // Prevenir bucle infinito
                  }}
                />
                <button 
                  className="remove-favorite-btn"
                  onClick={() => eliminarFavorito(favorito.id)}
                  aria-label="Eliminar de favoritos"
                >
                  <FaHeart />
                </button>
              </div>
              <div className="favorito-info" onClick={() => irAlDetalle(favorito)}>
                <h3 className="favorito-title">{favorito.nombre || "Alojamiento sin nombre"}</h3>
                <p className="favorito-description">
                  {favorito.descripcion || "Sin descripción disponible"}
                </p>
                <p className="favorito-price">
                  ${favorito.precio || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


FavoritosTab.propTypes = {
  favoritos: PropTypes.array.isRequired,
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  actualizarFavoritos: PropTypes.func.isRequired
};

export default FavoritosTab; 
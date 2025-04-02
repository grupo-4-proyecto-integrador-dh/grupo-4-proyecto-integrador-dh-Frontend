import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const favoritosCache = new Map();
const FAVORITO_CHANGED_EVENT = "favoritoChanged";

class FavoritosService {
  static notificarCambioFavorito(clienteId, alojamientoId, esFavorito) {
    sessionStorage.setItem(
      `favorito_${clienteId}_${alojamientoId}`,
      JSON.stringify(esFavorito)
    );
    try {
      const event = new StorageEvent("storage", {
        key: `favorito_${clienteId}_${alojamientoId}`,
        newValue: JSON.stringify(esFavorito),
        url: window.location.href,
      });
      window.dispatchEvent(event);

      const customEvent = new CustomEvent(FAVORITO_CHANGED_EVENT, {
        detail: {
          clienteId,
          alojamientoId,
          esFavorito,
        },
      });
      window.dispatchEvent(customEvent);
    } catch (error) {
      console.error("Error al notificar cambio de favorito:", error);
    }
  }

  static async obtenerFavoritos(clienteId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/favoritos/cliente/${clienteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        response.data.forEach((favorito) => {
          const cacheKey = `${clienteId}_${favorito.id}`;
          favoritosCache.set(cacheKey, true);

          this.notificarCambioFavorito(clienteId, favorito.id, true);
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      throw error;
    }
  }

  static async esFavorito(clienteId, alojamientoId) {
    const cacheKey = `${clienteId}_${alojamientoId}`;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/favoritos/cliente/${clienteId}/alojamiento/${alojamientoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const esFav = !!response.data;
      favoritosCache.set(cacheKey, esFav);
      this.notificarCambioFavorito(clienteId, alojamientoId, esFav);

      return esFav;
    } catch (error) {
      console.error("Error al verificar favorito:", error);
      favoritosCache.set(cacheKey, false);
      this.notificarCambioFavorito(clienteId, alojamientoId, false);

      return false;
    }
  }

  static async agregarFavorito(clienteId, alojamientoId) {
    const cacheKey = `${clienteId}_${alojamientoId}`;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/favoritos/cliente/${clienteId}/alojamiento/${alojamientoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      favoritosCache.set(cacheKey, true);
      this.notificarCambioFavorito(clienteId, alojamientoId, true);

      return response.data;
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      throw error;
    }
  }

  static async eliminarFavorito(clienteId, alojamientoId) {
    const cacheKey = `${clienteId}_${alojamientoId}`;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/favoritos/cliente/${clienteId}/alojamiento/${alojamientoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      favoritosCache.set(cacheKey, false);

      this.notificarCambioFavorito(clienteId, alojamientoId, false);

      return response.data;
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      throw error;
    }
  }

  static async alternarFavorito(clienteId, alojamientoId) {
    const cacheKey = `${clienteId}_${alojamientoId}`;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/favoritos/cliente/${clienteId}/alojamiento/${alojamientoId}/alternar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nuevoEstado = !!response.data;
      favoritosCache.set(cacheKey, nuevoEstado);
      this.notificarCambioFavorito(clienteId, alojamientoId, nuevoEstado);
      return nuevoEstado;
    } catch (error) {
      console.error("Error al alternar favorito:", error);
      throw error;
    }
  }

  static limpiarCache(clienteId) {
    for (const key of favoritosCache.keys()) {
      if (key.startsWith(`${clienteId}_`)) {
        favoritosCache.delete(key);
      }
    }
  }
}

export default FavoritosService;

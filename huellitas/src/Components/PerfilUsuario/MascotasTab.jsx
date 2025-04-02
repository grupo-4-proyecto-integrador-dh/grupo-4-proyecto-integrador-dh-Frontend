import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";

const MascotasTab = ({ mascotas, userId, token, url_base, actualizarMascotas }) => {
  const navigate = useNavigate();
  const [editandoMascota, setEditandoMascota] = useState(false);
  const [actualizandoDatos, setActualizandoDatos] = useState(false);
  const [mascotaEditada, setMascotaEditada] = useState({
    id: null,
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    peso: "",
    observaciones: ""
  });

  // Función para ir a la página de registro de mascotas
  const irARegistroMascota = () => {
    navigate("/RegistroMascota");
  };

  // Función para iniciar la edición de una mascota
  const iniciarEdicionMascota = (mascota) => {
    setMascotaEditada({
      id: mascota.id,
      nombre: mascota.nombre || "",
      especie: mascota.especie || "",
      raza: mascota.raza || "",
      edad: mascota.edad || "",
      peso: mascota.peso || "",
      observaciones: mascota.observaciones || ""
    });
    setEditandoMascota(true);
  };

  // Función para manejar cambios en los campos de la mascota
  const handleCambioInputMascota = (campo, valor) => {
    setMascotaEditada({
      ...mascotaEditada,
      [campo]: valor
    });
  };

  // Función para cancelar la edición de la mascota
  const cancelarEdicionMascota = () => {
    setEditandoMascota(false);
    setMascotaEditada({
      id: null,
      nombre: "",
      especie: "",
      raza: "",
      edad: "",
      peso: "",
      observaciones: ""
    });
  };

  // Función para guardar los cambios de la mascota editada
  const guardarCambiosMascota = async () => {
    // Obtener el token más reciente
    const tokenActual = localStorage.getItem("token");
    
    if (!tokenActual) {
      Swal.fire({
        title: "Error de sesión",
        text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        icon: "error"
      }).then(() => {
        navigate("/login");
      });
      return;
    }
    
    // Validaciones
    if (!mascotaEditada.nombre || mascotaEditada.nombre.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "El nombre de la mascota no puede estar vacío",
        icon: "error"
      });
      return;
    }
    
    setActualizandoDatos(true);
    
    try {
      // Preparar los datos para la API
      const datosActualizados = {
        id: mascotaEditada.id,
        nombre: mascotaEditada.nombre,
        especie: mascotaEditada.especie || null,
        raza: mascotaEditada.raza || null,
        edad: mascotaEditada.edad ? parseInt(mascotaEditada.edad) : null,
        peso: mascotaEditada.peso ? parseFloat(mascotaEditada.peso) : null,
        observaciones: mascotaEditada.observaciones || null,
        clienteId: userId
      };
      
      console.log("Enviando actualización de mascota:", datosActualizados);
      
      // Llamar al endpoint para actualizar la mascota
      const response = await axios.put(
        `${url_base}/api/mascotas/${mascotaEditada.id}/cliente/${userId}`,
        datosActualizados,
        {
          headers: {
            Authorization: `Bearer ${tokenActual}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Respuesta de actualización de mascota:", response.data);
      
      // Actualizar la lista de mascotas
      const mascotasActualizadas = mascotas.map(mascota => 
        mascota.id === mascotaEditada.id ? response.data : mascota
      );
      
      actualizarMascotas(mascotasActualizadas);
      
      // Limpiar el estado de edición
      setEditandoMascota(false);
      setMascotaEditada({
        id: null,
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        peso: "",
        observaciones: ""
      });
      
      Swal.fire({
        title: "¡Actualizado!",
        text: "La información de tu mascota ha sido actualizada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      let mensajeError = "No se pudieron guardar los cambios. Intenta nuevamente más tarde.";
      
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
        console.error("Status del error:", error.response.status);
        
        if (error.response.status === 403) {
          mensajeError = "No tienes permiso para actualizar esta mascota.";
        } else if (error.response.status === 404) {
          mensajeError = "No se encontró la mascota especificada.";
        }
      }
      
      Swal.fire({
        title: "Error",
        text: mensajeError,
        icon: "error"
      });
    } finally {
      setActualizandoDatos(false);
    }
  };

  // Renderizado del componente
  return (
    <div className="mascotas-tab">
      <h2>Mis Mascotas</h2>
      <div className="add-mascota">
        <button 
          className="add-mascota-btn"
          onClick={irARegistroMascota}
        >
          + Agregar mascota
        </button>
      </div>
      
      {mascotas.length === 0 ? (
        <div className="empty-state">
          <p>No tienes mascotas registradas.</p>
          <button 
            className="action-btn"
            onClick={irARegistroMascota}
          >
            Registrar mascota
          </button>
        </div>
      ) : (
        <div className="mascotas-list">
          {mascotas.map((mascota) => (
            <div key={mascota.id} className="mascota-card">
              <div className="mascota-header">
                <h3>{mascota.nombre}</h3>
                <div className="mascota-actions">
                  <button 
                    className="btn-edit-mascota"
                    onClick={() => iniciarEdicionMascota(mascota)}
                    title="Editar mascota"
                  >
                    <FaPencilAlt /> Editar
                  </button>
                </div>
              </div>
              <div className="mascota-info">
                <div><strong>Especie:</strong> {mascota.especie || 'No especificada'}</div>
                <div><strong>Raza:</strong> {mascota.raza || 'No especificada'}</div>
                <div><strong>Edad:</strong> {mascota.edad ? `${mascota.edad} años` : 'No especificada'}</div>
                <div><strong>Peso:</strong> {mascota.peso ? `${mascota.peso} kg` : 'No especificado'}</div>
                
                {mascota.observaciones && (
                  <div className="mascota-observaciones">
                    <strong>Observaciones:</strong>
                    <p>{mascota.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición de mascota */}
      {editandoMascota && (
        <div className="mascota-edit-modal">
          <div className="mascota-edit-content">
            <h3>Editar Mascota</h3>
            <form className="mascota-edit-form">
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={mascotaEditada.nombre}
                  onChange={(e) => handleCambioInputMascota("nombre", e.target.value)}
                  placeholder="Nombre de la mascota"
                  required
                />
              </div>
              <div className="form-group">
                <label>Especie:</label>
                <input
                  type="text"
                  value={mascotaEditada.especie}
                  onChange={(e) => handleCambioInputMascota("especie", e.target.value)}
                  placeholder="Perro, gato, etc."
                />
              </div>
              <div className="form-group">
                <label>Raza:</label>
                <input
                  type="text"
                  value={mascotaEditada.raza}
                  onChange={(e) => handleCambioInputMascota("raza", e.target.value)}
                  placeholder="Raza de la mascota"
                />
              </div>
              <div className="form-group">
                <label>Edad (años):</label>
                <input
                  type="number"
                  value={mascotaEditada.edad}
                  onChange={(e) => handleCambioInputMascota("edad", e.target.value)}
                  placeholder="Edad en años"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Peso (kg):</label>
                <input
                  type="number"
                  value={mascotaEditada.peso}
                  onChange={(e) => handleCambioInputMascota("peso", e.target.value)}
                  placeholder="Peso en kilogramos"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>Observaciones:</label>
                <textarea
                  value={mascotaEditada.observaciones}
                  onChange={(e) => handleCambioInputMascota("observaciones", e.target.value)}
                  placeholder="Alergias, comportamiento, etc."
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-save"
                  onClick={guardarCambiosMascota}
                  disabled={actualizandoDatos}
                >
                  {actualizandoDatos ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={cancelarEdicionMascota}
                  disabled={actualizandoDatos}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MascotasTab; 
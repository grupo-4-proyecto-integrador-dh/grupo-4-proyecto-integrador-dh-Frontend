import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PerfilTab = ({ usuario, token, userId, url_base, actualizarUsuario }) => {
  const navigate = useNavigate();
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [actualizandoDatos, setActualizandoDatos] = useState(false);
  const [perfilEditado, setPerfilEditado] = useState({
    nombre: "",
    apellido: "",
    email: "",
    numeroTelefono: ""
  });

  // Iniciar la edición del perfil
  const iniciarEdicionPerfil = () => {
    if (usuario) {
      setPerfilEditado({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        numeroTelefono: usuario.numeroTelefono || ""
      });
      setEditandoPerfil(true);
    }
  };

  // Manejar cambios en los campos
  const handleCambioInput = (campo, valor) => {
    setPerfilEditado({
      ...perfilEditado,
      [campo]: valor
    });
  };

  // Función para guardar todos los cambios
  const handleGuardarPerfil = async () => {
    // Obtener el token más reciente del localStorage
    const tokenActual = localStorage.getItem("token");
    
    // Verificar si el token existe
    if (!tokenActual) {
      console.error("No hay token disponible en localStorage");
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
    if (!perfilEditado.nombre || perfilEditado.nombre.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "El nombre no puede estar vacío",
        icon: "error"
      });
      return;
    }

    if (!perfilEditado.apellido || perfilEditado.apellido.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "El apellido no puede estar vacío",
        icon: "error"
      });
      return;
    }

    if (!perfilEditado.email || perfilEditado.email.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "El email no puede estar vacío",
        icon: "error"
      });
      return;
    }

    // Validación básica de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(perfilEditado.email)) {
      Swal.fire({
        title: "Formato incorrecto",
        text: "Por favor ingresa un email válido",
        icon: "warning"
      });
      return;
    }

    // Validación del teléfono si está presente
    if (perfilEditado.numeroTelefono && perfilEditado.numeroTelefono.trim() !== "") {
      const telefonoPattern = /^\d{7,15}$/;
      if (!telefonoPattern.test(perfilEditado.numeroTelefono)) {
        Swal.fire({
          title: "Formato incorrecto",
          text: "El número de teléfono debe contener entre 7 y 15 dígitos",
          icon: "warning"
        });
        return;
      }
    }

    setActualizandoDatos(true);
    try {
      // Crear objeto con el formato exacto requerido (incluyendo el ID)
      const datosActualizados = {
        id: userId,
        nombre: perfilEditado.nombre,
        apellido: perfilEditado.apellido,
        email: perfilEditado.email,
        numeroTelefono: perfilEditado.numeroTelefono || ""
      };
      
      console.log("Enviando datos al servidor:", datosActualizados);
      console.log("Token:", tokenActual);
      
      // Corregir la URL para incluir el ID del perfil a actualizar
      const updateUrl = `${url_base}/perfil/${userId}`;
      console.log("URL:", updateUrl);
      
      // Llamar directamente al endpoint con los datos formateados y el token más reciente
      const response = await axios.put(
        updateUrl,
        datosActualizados,
        {
          headers: {
            Authorization: `Bearer ${tokenActual}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Respuesta del servidor:", response.data);
      
      // Actualizar el usuario en el estado y localStorage
      actualizarUsuario(response.data);
      
      setEditandoPerfil(false);
      
      Swal.fire({
        title: "¡Actualizado!",
        text: "Tu perfil ha sido actualizado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      let mensajeError = "No se pudo actualizar el perfil. Intenta nuevamente más tarde.";
      
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
        console.error("Status del error:", error.response.status);
        
        if (error.response.status === 403) {
          mensajeError = "No tienes permiso para actualizar este perfil. Tu sesión ha expirado.";
          // Si el error es de autorización, limpiar el localStorage y redirigir al login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          Swal.fire({
            title: "Error de sesión",
            text: mensajeError,
            icon: "error",
            confirmButtonText: "Iniciar sesión nuevamente"
          }).then(() => {
            navigate("/login");
          });
          return;
        } else if (error.response.status === 400) {
          mensajeError = "Los datos enviados no son válidos. Verifica la información.";
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

  const obtenerIniciales = () => {
    if (!usuario) return "";
    
    const nombre = usuario.nombre || "";
    const apellido = usuario.apellido || "";
    
    const inicialNombre = nombre.charAt(0).toUpperCase();
    const inicialApellido = apellido.charAt(0).toUpperCase();
    
    return `${inicialNombre}${inicialApellido}`;
  };

  return (
    <div className="perfil-tab">
      <h2>Datos Personales</h2>
      {!usuario ? (
        <div className="empty-state">
          <p>No se encontró información del usuario.</p>
          <button 
            className="action-btn"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
        </div>
      ) : (
        <div className="user-data">
          <div className="user-avatar">
            <div className="avatar-circle">
              {obtenerIniciales()}
            </div>
          </div>
          {!editandoPerfil ? (
            <div className="user-details">
              <div className="user-detail">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{usuario.nombre}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Apellido:</span>
                <span className="detail-value">{usuario.apellido}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{usuario.email}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Teléfono:</span>
                <span className="detail-value">
                  {usuario.numeroTelefono ? usuario.numeroTelefono : 'No especificado'}
                </span>
              </div>
              <div className="editar-perfil-container">
                <button 
                  className="btn-editar-perfil"
                  onClick={iniciarEdicionPerfil}
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          ) : (
            <div className="user-details editando">
              <div className="user-detail">
                <span className="detail-label">Nombre:</span>
                <input
                  type="text"
                  value={perfilEditado.nombre}
                  onChange={(e) => handleCambioInput("nombre", e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="campo-input"
                />
              </div>
              <div className="user-detail">
                <span className="detail-label">Apellido:</span>
                <input
                  type="text"
                  value={perfilEditado.apellido}
                  onChange={(e) => handleCambioInput("apellido", e.target.value)}
                  placeholder="Ingresa tu apellido"
                  className="campo-input"
                />
              </div>
              <div className="user-detail">
                <span className="detail-label">Email:</span>
                <input
                  type="email"
                  value={perfilEditado.email}
                  onChange={(e) => handleCambioInput("email", e.target.value)}
                  placeholder="Ingresa tu email"
                  className="campo-input"
                />
              </div>
              <div className="user-detail">
                <span className="detail-label">Teléfono:</span>
                <input
                  type="text"
                  value={perfilEditado.numeroTelefono}
                  onChange={(e) => handleCambioInput("numeroTelefono", e.target.value)}
                  placeholder="Ingresa tu número de teléfono"
                  className="campo-input"
                />
              </div>
              <div className="perfil-actions">
                <button 
                  className="btn-guardar"
                  onClick={handleGuardarPerfil}
                  disabled={actualizandoDatos}
                >
                  {actualizandoDatos ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button 
                  className="btn-cancelar"
                  onClick={() => setEditandoPerfil(false)}
                  disabled={actualizandoDatos}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfilTab; 
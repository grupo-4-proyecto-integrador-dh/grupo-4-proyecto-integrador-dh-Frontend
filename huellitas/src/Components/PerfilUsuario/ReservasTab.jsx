import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ReservasTab = ({ reservas, userId, token, url_base, actualizarReservas }) => {
  const navigate = useNavigate();

  // Función para formatear fechas
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "No especificada";
    
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para mapear el estado a una clase CSS
  const mapEstadoAClase = (estado) => {
    if (!estado) return "";
    
    switch (estado.toUpperCase()) {
      case "PENDIENTE":
        return "pendiente";
      case "CONFIRMADA":
        return "confirmada";
      case "CANCELADA":
        return "cancelada";
      default:
        return "";
    }
  };

  // Función para cancelar una reserva
  const cancelarReserva = async (reservaId) => {
    try {
      const confirmacion = await Swal.fire({
        title: "¿Cancelar reserva?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, mantener"
      });
      
      if (!confirmacion.isConfirmed) return;
      
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
      
      Swal.fire({
        title: "Cancelando reserva...",
        text: "Por favor espera",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Usar el endpoint correcto con clienteId como parámetro de consulta
      const response = await axios.post(
        `${url_base}/reservas/${reservaId}/cancelar?clienteId=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenActual}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Respuesta de cancelación:", response.data);
      
      // Actualizar el estado de la reserva en el listado
      const reservasActualizadas = reservas.map(reserva => 
        reserva.id === reservaId 
          ? { ...reserva, estado: "CANCELADA" } 
          : reserva
      );
      
      actualizarReservas(reservasActualizadas);
      
      Swal.fire({
        title: "Reserva cancelada",
        text: "La reserva ha sido cancelada exitosamente",
        icon: "success"
      });
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      
      let mensajeError = "No se pudo cancelar la reserva. Intenta nuevamente más tarde.";
      
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
        console.error("Status del error:", error.response.status);
        
        if (error.response.status === 403) {
          mensajeError = "No tienes permiso para cancelar esta reserva.";
        } else if (error.response.status === 400) {
          mensajeError = "No se pueden cancelar reservas ya iniciadas o finalizadas.";
        } else if (error.response.status === 404) {
          mensajeError = "Reserva no encontrada.";
        }
      }
      
      Swal.fire({
        title: "Error",
        text: mensajeError,
        icon: "error"
      });
    }
  };

  return (
    <div className="reservas-tab">
      <h2>Mis Reservas</h2>
      {reservas.length === 0 ? (
        <div className="empty-state">
          <p>No tienes reservas registradas.</p>
          <button 
            className="action-btn"
            onClick={() => navigate("/")}
          >
            Explorar alojamientos
          </button>
        </div>
      ) : (
        <div className="reservas-list">
          {reservas.map((reserva) => (
            <div 
              key={reserva.id} 
              className={`reserva-card ${mapEstadoAClase(reserva.estado)}`}
            >
              <div className="reserva-header">
                <h3>{reserva.alojamientoNombre}</h3>
                <span className={`reserva-status ${mapEstadoAClase(reserva.estado)}`}>
                  {reserva.estado}
                </span>
              </div>
              <div className="reserva-info">
                <div className="reserva-fechas">
                  <div><strong>Desde:</strong> {formatearFecha(reserva.fechaDesde)}</div>
                  <div><strong>Hasta:</strong> {formatearFecha(reserva.fechaHasta)}</div>
                </div>
                <div className="reserva-detalles">
                  <div><strong>Mascota:</strong> {reserva.mascotaNombre}</div>
                  <div><strong>Precio:</strong> ${reserva.alojamientoPrecio}</div>
                  {reserva.fechaCreacion && (
                    <div><strong>Reserva realizada:</strong> {formatearFecha(reserva.fechaCreacion)}</div>
                  )}
                </div>
              </div>
              <div className="reserva-actions">
                {reserva.estado !== "CANCELADA" && (
                  <button 
                    className="cancel-btn"
                    onClick={() => cancelarReserva(reserva.id)}
                  >
                    Cancelar reserva
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservasTab; 
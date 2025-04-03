import { useLocation } from "react-router-dom";
import "../Styles/ConfirmacionPage.css";

export default function ConfirmacionPage() {
  const location = useLocation();
  const { reserva, usuario } = location.state || {};

  if (!reserva || !usuario) {
    return (
      <div className="container">
        <h1 className="title">Error</h1>
        <p>
          No se encontraron datos de la reserva. Por favor, vuelve a intentarlo.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">¡Reserva confirmada!</h1>
      <p>
        Gracias por tu reserva, {usuario.nombre} {usuario.apellido}. Aquí tienes
        los detalles:
      </p>
      <div className="card">
        <div className="card-content">
          <h2 className="subtitle">Detalles del alojamiento</h2>
          <p>
            <strong>🏡 Nombre:</strong> {reserva.alojamiento.nombre}
          </p>
          <p>
            <strong>📌 Descripción:</strong> {reserva.alojamiento.descripcion}
          </p>
          <p>
            <strong>📅 Fechas:</strong> {reserva.fechaDesde} -{" "}
            {reserva.fechaHasta}
          </p>
          <p>
            <strong>🐶🐱 Mascota:</strong> {reserva.mascota.nombre}
          </p>
        </div>
      </div>
      <button
        className="submit-button"
        onClick={() => (window.location.href = "/")}
      >
        Volver al inicio
      </button>
    </div>
  );
}

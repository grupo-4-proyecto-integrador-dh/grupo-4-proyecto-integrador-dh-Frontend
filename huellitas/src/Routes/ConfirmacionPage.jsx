import { useLocation } from "react-router-dom";
import "../Styles/ConfirmacionPage.css";

export default function ConfirmacionPage() {
  const location = useLocation();
  const { reservaData } = location.state || {};

  if (!reservaData) {
    return (
      <div className="container_confirmacion_page">
        <h1 className="title_confirmacion_page">Error</h1>
        <p>
          No se encontraron datos de la reserva. Por favor, vuelve a intentarlo.
        </p>
      </div>
    );
  }

  return (
    <div className="container_confirmacion_page">
      <h1 className="title_confirmacion_page">¡Reserva confirmada!</h1>
      <p>
        Gracias por tu reserva, {reservaData.clienteNombre} {reservaData.clienteApellido}. Aquí tienes
        los detalles:
      </p>
      <div className="card_confirmacion_page">
        <div className="card-content_confirmacion_page">
          <h2 className="subtitle_confirmacion_page">Detalles del alojamiento</h2>
          <p>
            <strong>🏡 Nombre:</strong> {reservaData.alojamientoNombre}
          </p>
          <p>
            <strong>📌 Descripción:</strong> {reservaData.alojamientoDescripcion}
          </p>
          <p>
            <strong>📅 Fechas:</strong> {reservaData.fechaDesde} -{" "}
            {reservaData.fechaHasta}
          </p>
          <p>
            <strong>🐶🐱 Mascota:</strong> {reservaData.mascotaNombre}
          </p>
        </div>
      </div>
      <button
        className="submit-button_confirmacion_page"
        onClick={() => (window.location.href = "/")}
      >
        Volver al inicio
      </button>
    </div>
  );
}

import { useLocation } from "react-router-dom";

const RegistroReserva = () => {
  const location = useLocation();
  const { alojamientoId, fechaDesde, fechaHasta, mascotaId, usuario } = location.state || {};

  return (
    <div>
      <h2>Registro de Reserva</h2>
      <p>Alojamiento ID: {alojamientoId}</p>
      <p>Desde: {fechaDesde}</p>
      <p>Hasta: {fechaHasta}</p>
      <p>Mascota ID: {mascotaId}</p>
      <p>usuario ID:{usuario}</p>
    </div>
  );
};

export default RegistroReserva; 
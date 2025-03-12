import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Disponibilidad.scss";

const Disponibilidad = ({ obtenerFechasDisponibles }) => {
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerFechasDisponibles()
      .then((fechas) => setFechasDisponibles(fechas))
      .catch(() => setError("No se pudo obtener la información. Intente más tarde."));
  }, [obtenerFechasDisponibles]);

  const esFechaDisponible = (date) => {
    return fechasDisponibles.some((fecha) => new Date(fecha).toDateString() === date.toDateString());
  };

  return (
    <div className="disponibilidad-container">
      <h2>Disponibilidad</h2>
      {error && <p className="error">{error}</p>}
      <div className="calendarios">
        <Calendar
          tileClassName={({ date }) => (esFechaDisponible(date) ? "disponible" : "ocupado")}
        />
        <Calendar
          tileClassName={({ date }) => (esFechaDisponible(date) ? "disponible" : "ocupado")}
        />
      </div>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );
};

export default Disponibilidad;

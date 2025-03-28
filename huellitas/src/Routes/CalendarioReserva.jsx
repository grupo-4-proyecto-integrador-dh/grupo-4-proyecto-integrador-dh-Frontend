import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "../Styles/CalendarioReserva.scss";

const CalendarioReserva = ({ alojamientoId, onFechaSeleccionada, onClose }) => {
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaSalida, setFechaSalida] = useState(null);

  useEffect(() => {
    axios
      .get(`https://insightful-patience-production.up.railway.app/alojamientos`)
      .then((response) => {
        setFechasOcupadas(response.data.map((reserva) => new Date(reserva.fecha)));
      })
      .catch((error) => {
        console.error("Error al obtener fechas ocupadas:", error);
      });
  }, [alojamientoId]);

  const confirmarReserva = () => {
    if (!fechaInicio || !fechaSalida) {
      alert("Selecciona una fecha de inicio y una fecha de salida antes de confirmar.");
      return;
    }

    if (fechaInicio >= fechaSalida) {
      alert("La fecha de salida debe ser posterior a la fecha de inicio.");
      return;
    }

    axios
      .post("https://insightful-patience-production.up.railway.app/reservas", {
        alojamientoId,
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaSalida: fechaSalida.toISOString().split("T")[0],
      })
      .then(() => {
        alert(`¡Reserva confirmada desde el ${fechaInicio.toDateString()} hasta el ${fechaSalida.toDateString()}!`);
        onFechaSeleccionada({ fechaInicio, fechaSalida });
        onClose();
      })
      .catch((error) => {
        console.error("Error al realizar la reserva:", error);
        alert("Hubo un problema al realizar la reserva. Intenta de nuevo.");
      });
  };

  const tileClassName = ({ date }) => {
    const esFechaOcupada = fechasOcupadas.some((fechaOcupada) => fechaOcupada.toDateString() === date.toDateString());

    if (esFechaOcupada) {
      return "fecha-ocupada";
    }
    return "";
  };

  return (
    <div className="calendario-wrapper">
      <div className="calendarios-container">
        <Calendar
          onClickDay={setFechaInicio}
          tileClassName={tileClassName}
          value={fechaInicio}
          locale="es-ES"
          minDate={new Date()}
          maxDate={new Date(new Date().getFullYear(), 3, 30)} // Hasta abril
          defaultActiveStartDate={new Date(new Date().getFullYear(), 2, 1)} // Marzo
          selectRange={false}
        />
        <Calendar
          onClickDay={setFechaSalida}
          tileClassName={tileClassName}
          value={fechaSalida}
          locale="es-ES"
          minDate={new Date()}
          maxDate={new Date(new Date().getFullYear(), 3, 30)} // Hasta abril
          defaultActiveStartDate={new Date(new Date().getFullYear(), 3, 1)} // Abril
          selectRange={false}
        />
      </div>
      <div className="botones">
        <button onClick={confirmarReserva} className="confirm-button">
          Confirmar reserva
        </button>
        <button onClick={onClose} className="cancel-button">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CalendarioReserva;

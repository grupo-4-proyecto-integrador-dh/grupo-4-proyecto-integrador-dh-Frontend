import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import "../Styles/Detalle.scss";
import Galeria from "../Components/Detalle/Galeria";
import Reserva from "../Components/Detalle/Reserva";

const Detalle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [alojamiento, setAlojamiento] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const url = import.meta.env.VITE_BACKEND_URL + `/alojamientos/${id}`;

  useEffect(() => {
    if (!location.state) {
      axios.get(url)
        .then(response => {
          setAlojamiento(response.data);
        })
        .catch(error => console.error("Error cargando los detalles:", error));
    } else {
      setAlojamiento(location.state);
    }
  }, [id, location.state]);

  const handleReservarClick = () => {
    setMostrarCalendario(true); 
  };

  const confirmarReserva = () => {
    if (!fechaSeleccionada) {
      alert("Por favor, selecciona una fecha antes de confirmar la reserva.");
      return;
    }

    axios.post(import.meta.env.VITE_BACKEND_URL + "/reservas", {
      alojamientoId: id,
      fecha: fechaSeleccionada.toISOString().split("T")[0], 
    })
    .then(() => {
      alert(`¡Reserva confirmada para el ${fechaSeleccionada.toDateString()}!`);
      setMostrarCalendario(false);
    })
    .catch(error => {
      console.error("Error al realizar la reserva:", error);
      alert("Hubo un problema al realizar la reserva. Intenta de nuevo.");
    });
  };

  if (!alojamiento) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Volver
      </button>

      <div className="container-detalle">
        <div className="content">
          <div className="service-container">
            <h2 className="hospedaje-premium">{alojamiento.nombre}</h2>
            <Galeria imagenes={alojamiento.imagenes} />
            <div className="servicio-detalle">
              <h4>Descripción:</h4>
              <p>{alojamiento.descripcion}</p>
              <p>{alojamiento.precio}</p>
            </div>

            <button className="reserve-button" onClick={handleReservarClick}>
              Reservar ahora
            </button>

            {mostrarCalendario && (
              <div className="calendario-wrapper">
                <Calendar onClickDay={setFechaSeleccionada} />
                <button onClick={confirmarReserva} className="confirm-button">
                  Confirmar reserva
                </button>
                <button onClick={() => setMostrarCalendario(false)} className="cancel-button">
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detalle;

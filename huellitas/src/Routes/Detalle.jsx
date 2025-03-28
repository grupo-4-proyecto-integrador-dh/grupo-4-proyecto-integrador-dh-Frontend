import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import "../Styles/Detalle.scss";
import Calendario from "../Components/Detalle/Calendario";
import Galeria from "../Components/Detalle/Galeria";
import CalendarioReserva from "./CalendarioReserva"; 

const Detalle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [alojamiento, setAlojamiento] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([null, null]);
  const [mascotas, setMascotas] = useState([]);
  const [userID, setUserID] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);
  const [token, setToken] = useState(null);
  const [nuevaMascotaNombre, setNuevaMascotaNombre] = useState("");
  const [mostrarInputNuevaMascota, setMostrarInputNuevaMascota] = useState(false);
  const [fechasReservadas, setFechasReservadas] = useState([]); // Estado para las fechas reservadas

  const url_base = import.meta.env.VITE_BACKEND_URL;

  // Obtener el token y el usuario al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      setToken(token);
    }

    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserID(4); // Aquí deberías usar userData.id si el ID del usuario está en el objeto user
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
      }
    }
  }, []);

  // Obtener las mascotas cuando el token o el userID cambien
  useEffect(() => {
    if (token && userID) {
      const obtenerMascotas = async () => {
        try {
          setCargando(true);
          const response = await axios.get(`${url_base}/clientes/4`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMascotas(response.data.mascotas);
        } catch (error) {
          console.error("Error al obtener las mascotas:", error);
        } finally {
          setCargando(false);
        }
      };

      obtenerMascotas();
    }
  }, [token, userID]);

  // Obtener los detalles del alojamiento
  useEffect(() => {
    if (!location.state) {
      axios
        .get(`${url_base}/alojamientos/${id}`)
        .then((response) => {
          setAlojamiento(response.data);
        })
        .catch((error) => console.error("Error cargando los detalles:", error));
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

    axios.post("https://insightful-patience-production.up.railway.app/reservas", {
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

            {!mostrarCalendario && (
              <button className="reserve-button" onClick={() => setMostrarCalendario(true)}>
                Reservar ahora
              </button>
            )}

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
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "../Styles/Detalle.scss";
import Calendario from "../Components/Detalle/Calendario";
import Galeria from "../Components/Detalle/Galeria";

const Detalle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [alojamiento, setAlojamiento] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [userID, setUserID] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);
  const [token, setToken] = useState(null);

  const url_base = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(user); 

    if (user) {
      try {
        const userData = JSON.parse(user);
        const id = userData.id;
        setUserID(id); 
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
      }
    }
  }, []); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token); 

    if (token) {
        setToken(token);
    }
}, []);

useEffect(() => {
  if (userID !== null && token) { 
      console.log("userID actualizado:", userID);
      const obtenerMascotas = async () => {
          try {
              const response = await axios.get(`${url_base}/clientes/${userID}`, {
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
}, [userID, token]); 

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
    if (!fechaSeleccionada || !mascotaSeleccionada) {
      alert("Por favor, selecciona una fecha y una mascota antes de confirmar la reserva.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/reservas`, {
        alojamientoId: id,
        fecha: fechaSeleccionada.toISOString().split("T")[0],
        mascotaId: mascotaSeleccionada, 
      })
      .then(() => {
        alert(`¡Reserva confirmada para el ${fechaSeleccionada.toDateString()}!`);
        setMostrarCalendario(false);
      })
      .catch((error) => {
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
              <button className="reserve-button" onClick={handleReservarClick}>
                Reservar ahora
              </button>
            )}

            {mostrarCalendario && (
              <div className="calendario-wrapper">
                <Calendario
                  mensaje="Elige fechas de estadía"
                  onChange={(fecha) => setFechaSeleccionada(fecha)}
                />
                <div className="formulario-mascota-reserva">
                  <form action="">
                    <select
                      value={mascotaSeleccionada}
                      onChange={(e) => setMascotaSeleccionada(e.target.value)}
                    >
                      <option value="">Selecciona una mascota</option>
                      {mascotas.map((mascota) => (
                        <option key={mascota.id} value={mascota.id}>
                          {mascota.nombre}
                        </option>
                      ))}
                    </select>
                  </form>
                  <button onClick={confirmarReserva} className="confirm-button">
                    Confirmar reserva
                  </button>
                  <button
                    onClick={() => setMostrarCalendario(false)}
                    className="cancel-button"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detalle;
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
  const [nuevaMascotaNombre, setNuevaMascotaNombre] = useState("");
  const [mostrarInputNuevaMascota, setMostrarInputNuevaMascota] = useState(false); // Nuevo estado

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

  // Función para agregar una nueva mascota
  const agregarMascota = async () => {
    if (nuevaMascotaNombre.trim() === "") {
      alert("Por favor, ingresa un nombre para la mascota.");
      return;
    }
  
    try {
      setCargando(true);
  
      // Agregar la nueva mascota
      await axios.post(
        `${url_base}/mascotas`,
        {
          nombre: nuevaMascotaNombre,
          clienteId: userID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Obtener la lista actualizada de mascotas desde el servidor
      const response = await axios.get(`${url_base}/clientes/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Actualizar el estado local con las mascotas actualizadas
      setMascotas(response.data.mascotas);
      setNuevaMascotaNombre(""); // Limpiar el input
      setMostrarInputNuevaMascota(false); // Ocultar el input después de agregar la mascota
    } catch (error) {
      console.error("Error al agregar la mascota:", error);
    } finally {
      setCargando(false);
    }
  };

  // Confirmar la reserva
  const confirmarReserva = () => {
    if (!fechaSeleccionada || !mascotaSeleccionada) {
      alert("Por favor, selecciona una fecha y una mascota antes de confirmar la reserva.");
      return;
    }

    axios
      .post(`${url_base}/reservas`, {
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
              <button className="reserve-button" onClick={() => setMostrarCalendario(true)}>
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
                  {/* Lista de mascotas existentes */}
                  <form>
                    <select
                      value={mascotaSeleccionada}
                      onChange={(e) => setMascotaSeleccionada(e.target.value)}
                    >
                      <option value="">Selecciona una mascota</option>
                       {mascotas && Array.isArray(mascotas) && mascotas
                        .filter((mascota) => mascota != null) // Filtra elementos null o undefined
                        .map((mascota) => (
                          <option key={mascota.id} value={mascota.id}>
                            {mascota.nombre}
                          </option>
                        ))}
                    </select>
                  </form>

                  {/* Botón para mostrar el input de nueva mascota */}
                  {!mostrarInputNuevaMascota && (
                    <button
                      onClick={() => setMostrarInputNuevaMascota(true)}
                      className="confirm-button"
                    >
                      ➕ Agregar nueva mascota
                    </button>
                  )}

                  {/* Input para agregar una nueva mascota (solo se muestra si mostrarInputNuevaMascota es true) */}
                  {mostrarInputNuevaMascota && (
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Nombre de la mascota"
                        value={nuevaMascotaNombre}
                        onChange={(e) => setNuevaMascotaNombre(e.target.value)}
                      />
                      <button onClick={agregarMascota} className="confirm-button">
                        Agregar mascota
                     </button>
                      <button
                        onClick={() => setMostrarInputNuevaMascota(false)}
                        className="cancel-button-mascota"
                      >
                        X
                      </button>
                    </form>
                  )}

                  {/* Botones para confirmar o cancelar la reserva */}
                  <button onClick={() => {confirmarReserva();}} className="confirm-button">
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
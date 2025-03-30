

import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "../Styles/Detalle.scss";
import Swal from "sweetalert2";
import Galeria from "../Components/Detalle/Galeria";
import Calendario from "../Components/Detalle/Calendario";

const Detalle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [alojamiento, setAlojamiento] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([null, null]);
  const [mascotas, setMascotas] = useState([]);
  const [fechasReservadas, setFechasReservadas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [nuevaMascotaNombre, setNuevaMascotaNombre] = useState("");
  const [mostrarInputNuevaMascota, setMostrarInputNuevaMascota] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  const url_base = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      setToken(token);
      setIsLogin(true);
    }

    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserID(userData.id);
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
      }
    }
  }, []);

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
  }, [token, url_base, userID]);

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
  }, [id, location.state, url_base]);

  useEffect(() => {
    if (alojamiento) {
      axios
        .get(`${url_base}/alojamientos/${id}`)
        .then((response) => {
          if (response.data.reservas && Array.isArray(response.data.reservas)) {
            const fechas = response.data.reservas.map((reserva) => ({
              fechaInicio: new Date(reserva.fechaDesde),
              fechaFin: new Date(reserva.fechaHasta),
            }));
            setFechasReservadas(fechas);
          } else {
            setFechasReservadas([]);
          }
        })
        .catch((error) => console.error("Error al obtener las reservas:", error));
    }
  }, [alojamiento, id, url_base]);

  const handleReserveClick = () => {
    if (!isLogin) {
      Swal.fire({
        title: "¿Quién está ahí?",
        text: "Para poder realizar reservas, debes iniciar sesión con tu usuario.",
        icon: "question",
        confirmButtonText: "Iniciar sesión",
        showCancelButton: true,
        cancelButtonText: "Por ahora no",
        preConfirm: () => {
          navigate("/login?from=reservation", { state: { from: location } });
        },
      });
    } else {
      setMostrarCalendario(true);
    }
  };

  const agregarMascota = async () => {
    if (nuevaMascotaNombre.trim() === "") {
      alert("Por favor, ingresa un nombre para la mascota.");
      return;
    }

    try {
      setCargando(true);
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

      const response = await axios.get(`${url_base}/clientes/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMascotas(response.data.mascotas);
      setNuevaMascotaNombre("");
      setMostrarInputNuevaMascota(false);
    } catch (error) {
      console.error("Error al agregar la mascota:", error);
    } finally {
      setCargando(false);
    }
  };

  const confirmarReserva = () => {
    const [fechaInicio, fechaFin] = fechasSeleccionadas;

    if (!fechaInicio || !fechaFin || !mascotaSeleccionada) {
      alert("Por favor, selecciona las fechas y una mascota antes de confirmar la reserva.");
      return;
    }

    const fechaDesdeFormateada = fechaInicio.toISOString().split("T")[0];
    const fechaHastaFormateada = fechaFin.toISOString().split("T")[0];

    axios
      .post(
        `${url_base}/reservas`,
        {
          alojamientoId: id,
          fechaDesde: fechaDesdeFormateada,
          fechaHasta: fechaHastaFormateada,
          mascotaId: mascotaSeleccionada,
          clienteId: userID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert(`¡Reserva confirmada del ${fechaInicio.toLocaleDateString("es-ES")} al ${fechaFin.toLocaleDateString("es-ES")}!`);
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
              <button className="reserve-button" onClick={handleReserveClick}>
                Reservar ahora
              </button>
            )}

            {mostrarCalendario && (
              <div className="calendario-wrapper">
                <Calendario
                  mensaje="Elige fechas de estadía"
                  onChange={(fechas) => setFechasSeleccionadas(fechas)}
                  fechasReservadas={fechasReservadas}
                />
                <div className="formulario-mascota-reserva">
                  <form>
                    <select
                      className="form-select"
                      value={mascotaSeleccionada}
                      onChange={(e) => setMascotaSeleccionada(e.target.value)}
                    >
                      <option value="">Selecciona una mascota</option>
                      {mascotas
                        .filter((m) => m != null)
                        .map((mascota) => (
                          <option key={mascota.id} value={mascota.id}>
                            {mascota.nombre}
                          </option>
                        ))}
                    </select>
                  </form>

                  {!mostrarInputNuevaMascota && (
                    <button
                      onClick={() => setMostrarInputNuevaMascota(true)}
                      className="reserve-button"
                    >
                      ➕ Agregar nueva mascota
                    </button>
                  )}

                  {mostrarInputNuevaMascota && (
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        className="mascota_nueva"
                        type="text"
                        placeholder="Nombre de la mascota"
                        value={nuevaMascotaNombre}
                        onChange={(e) => setNuevaMascotaNombre(e.target.value)}
                      />
                      <button onClick={agregarMascota} className="reserve-button">
                        Agregar mascota
                      </button>
                      <button
                        onClick={() => setMostrarInputNuevaMascota(false)}
                        className="cancel-button"
                      >
                        Cancelar
                      </button>
                    </form>
                  )}

                  <button onClick={confirmarReserva} className="confirm-button">
                    Confirmar reserva
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

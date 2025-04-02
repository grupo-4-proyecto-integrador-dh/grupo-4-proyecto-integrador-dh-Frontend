import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { React, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "../Styles/Detalle.scss";
import Calendario from "../Components/Detalle/Calendario";
import Galeria from "../Components/Detalle/Galeria";

const Detalle = () => {
  const location = useLocation();
  const { alojamientoId, fechaDesde, fechaHasta, mascotaId, usuario } =
    location.state || {};
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
  const [mostrarInputNuevaMascota, setMostrarInputNuevaMascota] =
    useState(false);
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

  // Obtener las reservas del alojamiento
  useEffect(() => {
    if (alojamiento) {
      axios
        .get(`${url_base}/alojamientos/${id}`)
        .then((response) => {
          console.log("Respuesta del backend:", response.data); // Inspecciona la respuesta

          // Verifica si response.data.reservas es un array
          if (response.data.reservas && Array.isArray(response.data.reservas)) {
            const fechasReservadas = response.data.reservas.map((reserva) => ({
              fechaInicio: new Date(reserva.fechaDesde),
              fechaFin: new Date(reserva.fechaHasta),
            }));
            setFechasReservadas(fechasReservadas);
          } else {
            console.warn("No hay reservas para este alojamiento.");
            setFechasReservadas([]); // Inicializa con un array vacío
          }
        })
        .catch((error) =>
          console.error("Error al obtener las reservas:", error)
        );
    }
  }, [alojamiento, id]);

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
      const response = await axios.get(`${url_base}/clientes/4`, {
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

  const handleFechaSeleccionada = (fechas) => {
    if (!fechas || fechas.length < 2) return;

    const [fechaInicio, fechaFin] = fechas;

    // Convertir las fechas reservadas a timestamps para comparar fácilmente
    const fechasReservadasTimestamps = fechasReservadas.flatMap(
      ({ fechaInicio, fechaFin }) => {
        const rango = [];
        let actual = new Date(fechaInicio);
        const final = new Date(fechaFin);

        while (actual <= final) {
          rango.push(actual.getTime()); // Guardamos cada día como timestamp
          actual.setDate(actual.getDate() + 1);
        }
        return rango;
      }
    );

    // Verificar si alguna fecha en el rango seleccionado está reservada
    let actual = new Date(fechaInicio);
    let invalida = false;

    while (actual <= fechaFin) {
      if (fechasReservadasTimestamps.includes(actual.getTime())) {
        invalida = true;
        break;
      }
      actual.setDate(actual.getDate() + 1);
    }

    if (invalida) {
      Swal.fire({
        title: "Rango no disponible",
        text: "El rango seleccionado incluye fechas reservadas. Por favor, elige otro período.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    } else {
      setFechasSeleccionadas(fechas);
    }
  };

  // Confirmar la reserva
  const finalizarReserva = () => {
    const [fechaInicio, fechaFin] = fechasSeleccionadas;

    if (!fechaInicio && !fechaFin && !mascotaSeleccionada) {
      Swal.fire({
        title: "Error",
        text: "Por favor, selecciona las fechas y una mascota antes de confirmar la reserva.",
        icon: "error",
      });
      return;
    }

    if (!mascotaSeleccionada) {
      Swal.fire({
        title: "Error",
        text: "Por favor, selecciona una mascota antes de confirmar la reserva.",
        icon: "error",
      });
      return;
    }

    if (!fechaInicio || !fechaFin) {
      Swal.fire({
        title: "Error",
        text: "Por favor, selecciona las fechas de inicio y fin de estadia antes de confirmar la reserva.",
        icon: "error",
      });
      return;
    }

    // ✅ Convertir fechas reservadas a rangos de tiempo
    const hayConflicto = fechasReservadas.some(
      ({ fechaInicio: inicioReservada, fechaFin: finReservada }) => {
        return (
          (fechaInicio >= inicioReservada && fechaInicio <= finReservada) || // Si el inicio está dentro de un rango reservado
          (fechaFin >= inicioReservada && fechaFin <= finReservada) || // Si el fin está dentro de un rango reservado
          (fechaInicio <= inicioReservada && fechaFin >= finReservada) // Si el rango cubre toda la reserva
        );
      }
    );

    if (hayConflicto) {
      Swal.fire({
        title: "Error",
        text: "El rango de fechas seleccionado incluye una fecha ya reservada. Por favor, elige otro rango.",
        icon: "error",
      });
      return;
    }

    // ✅ Formatear fechas antes de enviarlas
    const fechaDesdeFormateada = fechaInicio.toISOString().split("T")[0];
    const fechaHastaFormateada = fechaFin.toISOString().split("T")[0];

    navigate("/registro-reserva", {
      state: {
        alojamientoId: id,
        fechaDesde: fechaDesdeFormateada,
        fechaHasta: fechaHastaFormateada,
        mascotaId: mascotaSeleccionada,
        usuario: userID,
      },
    });
  };

  if (!alojamiento) {
    return <div className="loading-message">Cargando...</div>;
  }

  return (
    <div className="reserva-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Volver
      </button>

      <div className="container-detalle">
        <div className="content">
          <div className="service-container">
            <Galeria imagenes={alojamiento.imagenes} />
            <span className="service-container__top-info">
              <h1 className="hospedaje-premium">{alojamiento.nombre}</h1>
              <p className="service-container__top-info__price">{`$ ${alojamiento.precio}`}</p>
            </span>
            <div className="servicio-detalle">
              <h2>Descripción:</h2>
              <p>{alojamiento.descripcion}</p>
              <strong>{`Precio por noche $ ${alojamiento.precio}`}</strong>
            </div>

            {!mostrarCalendario && (
              <button
                className="reserve-button"
                onClick={() => setMostrarCalendario(true)}
              >
                Reservar ahora
              </button>
            )}

            {mostrarCalendario && (
              <div className="calendario-wrapper">
                <Calendario
                  mensaje="Elige fechas de estadía"
                  onChange={handleFechaSeleccionada}
                  fechasReservadas={fechasReservadas} // Pasa las fechas reservadas
                />
                <div className="fechas_elegidas">
                  <p>Fechas elegidas</p>
                  <span>
                    Inicio: {fechasSeleccionadas[0]?.toLocaleDateString()}
                  </span>
                  <span>
                    Final: {fechasSeleccionadas[1]?.toLocaleDateString()}
                  </span>
                </div>
                <div className="formulario-mascota-reserva">
                  {/* Lista de mascotas existentes */}
                  <form>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={mascotaSeleccionada}
                      onChange={(e) => setMascotaSeleccionada(e.target.value)}
                    >
                      <option value="">Selecciona una mascota</option>
                      {mascotas &&
                        Array.isArray(mascotas) &&
                        mascotas
                          .filter((mascota) => mascota != null)
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

                  {/* Input para agregar una nueva mascota (solo se muestra si mostrarInputNuevaMascota es true) */}
                  {mostrarInputNuevaMascota && (
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        className="mascota_nueva"
                        type="text"
                        placeholder="Nombre de la mascota"
                        value={nuevaMascotaNombre}
                        onChange={(e) => setNuevaMascotaNombre(e.target.value)}
                      />
                      <button
                        onClick={agregarMascota}
                        className="reserve-button"
                      >
                        Agregar mascota
                      </button>
                      <button
                        onClick={() => setMostrarInputNuevaMascota(false)}
                        className="reserve-button"
                      >
                        X
                      </button>
                    </form>
                  )}

                  {/* Botones para confirmar o cancelar la reserva */}
                  <button onClick={finalizarReserva} className="reserve-button">
                    Finalizar reserva
                  </button>
                  <button
                    onClick={() => setMostrarCalendario(false)}
                    className="reserve-button"
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

import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "../Styles/Detalle.scss";
import Swal from "sweetalert2";
import Galeria from "../Components/Detalle/Galeria";
import Calendario from "../Components/Detalle/Calendario";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import FavoritosService from "../Services/FavoritosService";

const Detalle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [alojamiento, setAlojamiento] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([null, null]);
  const [fechasReservadas, setFechasReservadas] = useState([]);
  
  const [isLogin, setIsLogin] = useState(false);
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(null);
  
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [mostrarDetallesMascota, setMostrarDetallesMascota] = useState(false);
  
  const [mostrarInputNuevaMascota, setMostrarInputNuevaMascota] = useState(false);
  const [nuevaMascotaNombre, setNuevaMascotaNombre] = useState("");
  const [nuevaMascotaEspecie, setNuevaMascotaEspecie] = useState("");
  const [nuevaMascotaRaza, setNuevaMascotaRaza] = useState("");
  const [nuevaMascotaPeso, setNuevaMascotaPeso] = useState("");
  const [nuevaMascotaEdad, setNuevaMascotaEdad] = useState("");
  const [nuevaMascotaObservaciones, setNuevaMascotaObservaciones] = useState("");
  
  const [esFavorito, setEsFavorito] = useState(false);
  
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
    const verificarFavorito = async () => {
      if (isLogin && userID && id) {
        try {
          await FavoritosService.esFavorito(userID, Number(id));
        } catch (error) {
          console.error("Error al verificar favorito:", error);
        }
      }
    };
    
    if (isLogin && userID && id) {
      const estadoGuardado = sessionStorage.getItem(`favorito_${userID}_${id}`);
      if (estadoGuardado !== null) {
        setEsFavorito(JSON.parse(estadoGuardado));
      } else {
        verificarFavorito();
      }
    }

    const handleStorageChange = (e) => {
      if (e.key === `favorito_${userID}_${id}`) {
        const nuevoEstado = JSON.parse(e.newValue);
        setEsFavorito(nuevoEstado);
      }
    };

    const handleFavoritoChange = (e) => {
      if (e.detail && e.detail.clienteId === userID && e.detail.alojamientoId === Number(id)) {
        setEsFavorito(e.detail.esFavorito);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritoChanged', handleFavoritoChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritoChanged', handleFavoritoChange);
    };
  }, [userID, id, isLogin]);

  useEffect(() => {
    if (token && userID) {
      obtenerMascotasDelCliente();
    }
  }, [token, userID]);

  const handleFavoritoClick = async () => {
    if (!isLogin) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para añadir favoritos",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
      return;
    }

    try {
      if (esFavorito) {
        await FavoritosService.eliminarFavorito(userID, Number(id));
      } else {
        await FavoritosService.agregarFavorito(userID, Number(id));
      }
      
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: !esFavorito
          ? "¡Añadido a favoritos!" 
          : "Eliminado de favoritos",
        showConfirmButton: false,
        timer: 1500,
        toast: true
      });
    } catch (error) {
      console.error("Error al modificar favorito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar favoritos",
        timer: 2000
      });
    }
  };

  const obtenerMascotasDelCliente = async () => {
    try {
      setCargando(true);
      
      console.log(`Intentando obtener mascotas para el cliente con ID: ${userID}`);
      console.log(`URL completa: ${url_base}/api/mascotas/cliente/${userID}`);
      console.log(`Token: ${token}`);
      
      const response = await axios.get(`${url_base}/api/mascotas/cliente/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Respuesta completa del servidor:", response);
      
      if (response.data && Array.isArray(response.data)) {
        console.log("Mascotas recibidas:", response.data);
        setMascotas(response.data);
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.content)) {
          console.log("Mascotas encontradas en response.data.content:", response.data.content);
          setMascotas(response.data.content);
        } else if (Array.isArray(response.data.mascotas)) {
          console.log("Mascotas encontradas en response.data.mascotas:", response.data.mascotas);
          setMascotas(response.data.mascotas);
        } else {
          console.warn("La respuesta no contiene un array de mascotas reconocible:", response.data);
          setMascotas([]);
        }
      } else {
        console.warn("La respuesta no contiene un array de mascotas:", response.data);
        setMascotas([]);
      }
    } catch (error) {
      console.error("Error al obtener las mascotas del cliente:", error);
      console.error("Detalles del error:", error.response ? error.response.data : "No hay detalles adicionales");
      console.error("Estado de la respuesta:", error.response ? error.response.status : "No hay estado");
      setMascotas([]);
    } finally {
      setCargando(false);
    }
  };

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
          console.log("Respuesta del backend:", response.data);
  
          if (response.data.reservas && Array.isArray(response.data.reservas)) {
            // Filtrar reservas para excluir las que tienen estado "CANCELADA"
            const reservasActivas = response.data.reservas.filter(
              (reserva) => reserva.estado !== "CANCELADA"
            );
            
            console.log("Reservas después de filtrar canceladas:", reservasActivas);
            
            const fechasReservadas = reservasActivas.map((reserva) => ({
              fechaInicio: new Date(reserva.fechaDesde),
              fechaFin: new Date(reserva.fechaHasta),
            }));
            setFechasReservadas(fechasReservadas);
            console.log(fechasReservadas)
          } else {
            console.warn("No hay reservas para este alojamiento.");
            setFechasReservadas([]);
          }
        })
        .catch((error) =>
          console.error("Error al obtener las reservas:", error)
        );
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
          navigate('/login?from=reservation', { state: { from: location } });
        }
      });
    } else {
      setMostrarCalendario(true);
    }
  };

  const agregarMascota = async () => {
    if (nuevaMascotaNombre.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingresa un nombre para la mascota.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    try {
      setCargando(true);
      
      const mascotaData = {
        nombre: nuevaMascotaNombre,
        clienteId: userID,
        especie: nuevaMascotaEspecie || null,
        raza: nuevaMascotaRaza || null,
        peso: nuevaMascotaPeso ? parseFloat(nuevaMascotaPeso) : null,
        edad: nuevaMascotaEdad ? parseInt(nuevaMascotaEdad) : null,
        observaciones: nuevaMascotaObservaciones || null,
        activo: true
      };
      
      console.log("Intentando agregar mascota con los datos:", mascotaData);
      console.log(`URL completa: ${url_base}/api/mascotas`);
      console.log(`Token: ${token}`);

      try {
        const mascotaDataAlt1 = { ...mascotaData, clienteId: userID.toString() };
        console.log("Alternativa 1 - clienteId como string:", mascotaDataAlt1);
        
        const mascotaDataAlt2 = { 
          ...mascotaData, 
          cliente: { id: userID },
          clienteId: undefined 
        };
        console.log("Alternativa 2 - usando cliente.id:", mascotaDataAlt2);
        
        const response = await axios.post(
          `${url_base}/api/mascotas`,
          mascotaData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        );
        
        console.log("Respuesta al agregar mascota:", response);
      } catch (innerError) {
        console.error("Error en el primer intento, probando alternativa:", innerError);
        
        try {
          const response = await axios.post(
            `${url_base}/api/mascotas`,
            { ...mascotaData, clienteId: userID.toString() },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
            }
          );
          console.log("Respuesta al agregar mascota (alt1):", response);
        } catch (innerError2) {
          console.error("Error en el segundo intento, probando alternativa 2:", innerError2);
          
          const response = await axios.post(
            `${url_base}/api/mascotas`,
            { 
              nombre: nuevaMascotaNombre,
              cliente: { id: userID },
              especie: nuevaMascotaEspecie || null,
              raza: nuevaMascotaRaza || null,
              peso: nuevaMascotaPeso ? parseFloat(nuevaMascotaPeso) : null,
              edad: nuevaMascotaEdad ? parseInt(nuevaMascotaEdad) : null,
              observaciones: nuevaMascotaObservaciones || null,
              activo: true
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
            }
          );
          console.log("Respuesta al agregar mascota (alt2):", response);
        }
      }

      await obtenerMascotasDelCliente();

      setNuevaMascotaNombre("");
      setNuevaMascotaEspecie("");
      setNuevaMascotaRaza("");
      setNuevaMascotaPeso("");
      setNuevaMascotaEdad("");
      setNuevaMascotaObservaciones("");
      
      setMostrarInputNuevaMascota(false);

      Swal.fire({
        title: "¡Mascota agregada!",
        text: "Tu mascota ha sido agregada exitosamente.",
        icon: "success",
        confirmButtonText: "Genial"
      });
    } catch (error) {
      console.error("Error al agregar la mascota:", error);
      console.error("Detalles del error:", error.response ? error.response.data : "No hay detalles adicionales");
      console.error("Estado de la respuesta:", error.response ? error.response.status : "No hay estado");
      Swal.fire({
        title: "Error",
        text: "No se pudo agregar la mascota. Por favor, intenta nuevamente.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setCargando(false);
    }
  };


  const handleFechaSeleccionada = (fechas) => {
    if (!fechas || fechas.length < 2) return;
  
    const [fechaInicio, fechaFin] = fechas;
  
    const fechasReservadasTimestamps = fechasReservadas.flatMap(({ fechaInicio, fechaFin }) => {
      const rango = [];
      let actual = new Date(fechaInicio);
      const final = new Date(fechaFin);
  
      while (actual <= final) {
        rango.push(actual.getTime());
        actual.setDate(actual.getDate() + 1);
      }
      return rango;
    });
  
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

  const finalizarReserva = async () => {
      const [fechaInicio, fechaFin] = fechasSeleccionadas;

      if (!fechaInicio && !fechaFin && !mascotaSeleccionada ) {
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

      if (!fechaInicio || !fechaFin ) {
        Swal.fire({
          title: "Error",
          text: "Por favor, selecciona las fechas de inicio y fin de estadia antes de confirmar la reserva.",
          icon: "error",
        });
        return;
      }
    
      const hayConflicto = fechasReservadas.some(({ fechaInicio: inicioReservada, fechaFin: finReservada }) => {
        return (
          (fechaInicio >= inicioReservada && fechaInicio <= finReservada) ||
          (fechaFin >= inicioReservada && fechaFin <= finReservada) ||
          (fechaInicio <= inicioReservada && fechaFin >= finReservada)
        );
      });
    
      if (hayConflicto) {
        Swal.fire({
          title: "Error",
          text: "El rango de fechas seleccionado incluye una fecha ya reservada. Por favor, elige otro rango.",
          icon: "error",
        });
        return;
      }
    
      try {
        setCargando(true);
        
        const fechaDesdeFormateada = fechaInicio.toISOString().split("T")[0];
        const fechaHastaFormateada = fechaFin.toISOString().split("T")[0];
        
        const mascotaSeleccionadaObj = mascotas.find(m => m.id.toString() === mascotaSeleccionada.toString());
        
        if (!mascotaSeleccionadaObj) {
          throw new Error("No se pudo encontrar la información de la mascota seleccionada");
        }
        
        const userData = JSON.parse(localStorage.getItem("user"));
        
        if (!userData) {
          throw new Error("No se encontró información del usuario");
        }

        const reservaData = {
          fechaDesde: fechaDesdeFormateada,
          fechaHasta: fechaHastaFormateada,
          mascotaNombre: mascotaSeleccionadaObj.nombre,
          mascotaId: Number(mascotaSeleccionada),
          alojamientoNombre: alojamiento.nombre,
          alojamientoDescripcion:alojamiento.descripcion,
          alojamientoId: Number(id),
          alojamientoPrecio: alojamiento.precio,
          clienteNombre: userData.nombre || "",
          clienteApellido: userData.apellido || "",
          clienteEmail: userData.email || "",
          estado: "PENDIENTE",
        };
        navigate("/reserva", { state: { reservaData } });
        
        console.log("Enviando solicitud de reserva con los datos:", reservaData);
        
        Swal.fire({
          title: "Error",
          text: "No se pudo completar la reserva. Por favor, intenta nuevamente más tarde.",
          icon: "error",
          confirmButtonText: "OK"
        });
      } finally {
        setCargando(false);
      }
  };

  if (!alojamiento) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="reserva-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Volver
      </button>

      <div className="container-detalle">
        <div className="content">
          <div className="service-container">
            <div className="hospedaje-header">
              <h2 className="hospedaje-premium">{alojamiento.nombre}</h2>
              <button 
                className={`favorito-btn-detalle ${esFavorito ? 'active' : ''}`} 
                onClick={handleFavoritoClick}
                aria-label={esFavorito ? "Eliminar de favoritos" : "Añadir a favoritos"}
              >
                {esFavorito ? <FaHeart color="#e76f51" size={24} /> : <FaRegHeart size={24} />}
              </button>
            </div>
            <Galeria imagenes={alojamiento.imagenes} />
            <span className="service-container__top-info">
              <h1 className="hospedaje-premium">{alojamiento.nombre}</h1>
              <p className="service-container__top-info__price">{`Precio por noche $ ${alojamiento.precio}`}</p>
            </span>
            <div className="servicio-detalle">
              <h2>Descripción:</h2>
              <p>{alojamiento.descripcion}</p>
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
                  onChange={handleFechaSeleccionada}
                  fechasReservadas={fechasReservadas}
                />
                <div className="fechas_elegidas">
                  <p>Fechas elegidas</p>
                  <span>Inicio:  {fechasSeleccionadas[0]?.toLocaleDateString()}</span>
                  <span>Final:   {fechasSeleccionadas[1]?.toLocaleDateString()}</span>
                </div>
                <div className="formulario-mascota-reserva" style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '15px',
                  marginTop: '20px',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>Selecciona tu mascota</h3>
                  
                  {cargando ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <p>Cargando mascotas...</p>
                      <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        margin: '10px auto',
                        border: '4px solid rgba(0, 0, 0, 0.1)',
                        borderLeft: '4px solid #7983ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <style>
                        {`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}
                      </style>
                    </div>
                  ) : (
                    <>
                      <form>
                        <select 
                          className="form-select" 
                          aria-label="Default select example"
                          value={mascotaSeleccionada}
                          onChange={(e) => setMascotaSeleccionada(e.target.value)}
                          style={{
                            padding: '10px',
                            borderRadius: '5px',
                            width: '100%',
                            marginBottom: '10px'
                          }}
                        >
                          <option value="">Selecciona una mascota</option>
                          {mascotas && Array.isArray(mascotas) && mascotas
                            .filter((mascota) => mascota != null)
                            .map((mascota) => (
                              <option key={mascota.id} value={mascota.id}>
                                {mascota.nombre} 
                                {mascota.especie ? ` - ${mascota.especie}` : ''} 
                                {mascota.raza ? ` (${mascota.raza})` : ''} 
                                {mascota.edad ? ` - ${mascota.edad} años` : ''}
                              </option>
                            ))}
                        </select>
                      </form>
                      
                      {mascotas.length === 0 && (
                        <div style={{ 
                          padding: '15px',
                          backgroundColor: '#fff8e1',
                          border: '1px solid #ffecb3',
                          borderRadius: '5px',
                          marginBottom: '10px'
                        }}>
                          <p style={{ margin: 0 }}>No tienes mascotas registradas. ¡Agrega una para continuar!</p>
                        </div>
                      )}
                      
                      {mascotaSeleccionada && (
                        <button 
                          onClick={() => setMostrarDetallesMascota(!mostrarDetallesMascota)} 
                          className="reserve-button"
                          style={{
                            marginTop: '5px',
                            marginBottom: '5px'
                          }}
                        >
                          {mostrarDetallesMascota ? 'Ocultar detalles' : 'Ver detalles'}
                        </button>
                      )}
                      
                      {mostrarDetallesMascota && mascotaSeleccionada && (
                        <div className="detalles-mascota" style={{
                          padding: '15px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          backgroundColor: '#fff',
                          marginBottom: '15px'
                        }}>
                          {mascotas
                            .filter(mascota => mascota && mascota.id.toString() === mascotaSeleccionada.toString())
                            .map(mascota => (
                              <div key={mascota.id} className="card-detalles-mascota">
                                <h4 style={{ 
                                  margin: '0 0 10px 0',
                                  color: '#333',
                                  borderBottom: '1px solid #eee',
                                  paddingBottom: '5px'
                                }}>{mascota.nombre}</h4>
                                <p style={{ margin: '5px 0' }}><strong>Especie:</strong> {mascota.especie || 'No especificada'}</p>
                                <p style={{ margin: '5px 0' }}><strong>Raza:</strong> {mascota.raza || 'No especificada'}</p>
                                <p style={{ margin: '5px 0' }}><strong>Edad:</strong> {mascota.edad ? `${mascota.edad} años` : 'No especificada'}</p>
                                <p style={{ margin: '5px 0' }}><strong>Peso:</strong> {mascota.peso ? `${mascota.peso} kg` : 'No especificado'}</p>
                                <p style={{ margin: '5px 0' }}><strong>Observaciones:</strong> {mascota.observaciones || 'Sin observaciones'}</p>
                              </div>
                            ))}
                        </div>
                      )}
   
                      {!mostrarInputNuevaMascota && (
                        <button
                          onClick={() => setMostrarInputNuevaMascota(true)}
                          className="reserve-button"
                        >
                          ➕ Agregar nueva mascota
                        </button>
                      )}

                      {mostrarInputNuevaMascota && (
                        <form className="formulario-nueva-mascota" onSubmit={(e) => e.preventDefault()} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '15px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          backgroundColor: '#fff'
                        }}>
                          <input className="mascota_nueva"
                            type="text"
                            placeholder="Nombre de la mascota*"
                            value={nuevaMascotaNombre}
                            onChange={(e) => setNuevaMascotaNombre(e.target.value)}
                            required
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <input className="mascota_nueva"
                            type="text"
                            placeholder="Especie (perro, gato, etc.)"
                            value={nuevaMascotaEspecie}
                            onChange={(e) => setNuevaMascotaEspecie(e.target.value)}
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <input className="mascota_nueva"
                            type="text"
                            placeholder="Raza"
                            value={nuevaMascotaRaza}
                            onChange={(e) => setNuevaMascotaRaza(e.target.value)}
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <input className="mascota_nueva"
                            type="number"
                            step="0.1"
                            placeholder="Peso en kg"
                            value={nuevaMascotaPeso}
                            onChange={(e) => setNuevaMascotaPeso(e.target.value)}
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <input className="mascota_nueva"
                            type="number"
                            placeholder="Edad en años"
                            value={nuevaMascotaEdad}
                            onChange={(e) => setNuevaMascotaEdad(e.target.value)}
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <textarea className="mascota_nueva"
                            placeholder="Observaciones (alergias, comportamiento, etc.)"
                            value={nuevaMascotaObservaciones}
                            onChange={(e) => setNuevaMascotaObservaciones(e.target.value)}
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              border: '1px solid #ccc',
                              minHeight: '80px',
                              resize: 'vertical'
                            }}
                          />
                          <div className="botones-formulario" style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '10px'
                          }}>
                            <button 
                              onClick={agregarMascota} 
                              className="reserve-button"
                              disabled={cargando}
                            >
                              {cargando ? 'Agregando...' : 'Agregar mascota'}
                            </button>
                            <button
                              onClick={() => setMostrarInputNuevaMascota(false)}
                              className="reserve-button"
                              disabled={cargando}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      )}

                      <div style={{ 
                        display: 'flex', 
                        gap: '10px',
                        marginTop: '15px',
                        justifyContent: 'space-between'
                      }}>
                        <button 
                          onClick={finalizarReserva} 
                          className="reserve-button" 
                          style={{ flex: 1 }}
                          disabled={cargando}
                        >
                          Finalizar reserva
                        </button>
                        <button
                          onClick={() => setMostrarCalendario(false)}
                          className="reserve-button"
                          style={{ flex: 1 }}
                          disabled={cargando}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  )}
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

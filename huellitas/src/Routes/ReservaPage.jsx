/*

try {
  const response = await axios.post(
    `${url_base}/reservas`,
    reservaData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    }
  );
  
  console.log("Respuesta del servidor a la reserva:", response);
} catch (errorPost1) {
  console.error("Error en el primer intento de reserva:", errorPost1);
  
  try {
    const reservaDataAlt = {
      ...reservaData,
      mascota: { id: Number(mascotaSeleccionada) },
      alojamiento: { id: Number(id) },
      cliente: { id: Number(userID) }
    };
    
    console.log("Intento alternativo con formato relacional:", reservaDataAlt);
    
    const response = await axios.post(
      `${url_base}/reservas`,
      reservaDataAlt,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    );
    
    console.log("Respuesta al segundo intento:", response);
  } catch (errorPost2) {
    console.error("Error en el segundo intento de reserva:", errorPost2);
    
    const reservaDataMinimal = {
      fechaDesde: fechaDesdeFormateada,
      fechaHasta: fechaHastaFormateada,
      mascotaId: Number(mascotaSeleccionada),
      alojamientoId: Number(id),
      clienteId: Number(userID)
    };
    
    console.log("Intento con formato simplificado:", reservaDataMinimal);
    
    const response = await axios.post(
      `${url_base}/reservas`,
      reservaDataMinimal,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    );
    
    console.log("Respuesta al tercer intento:", response);
  }
}

axios
  .get(`${url_base}/alojamientos/${id}`)
  .then((response) => {
    if (response.data.reservas && Array.isArray(response.data.reservas)) {
      // Actualizar fechas reservadas excluyendo las canceladas
      const reservasActivas = response.data.reservas.filter(
        (reserva) => reserva.estado !== "CANCELADA"
      );
      
      const fechasReservadas = reservasActivas.map((reserva) => ({
        fechaInicio: new Date(reserva.fechaDesde),
        fechaFin: new Date(reserva.fechaHasta),
      }));
      setFechasReservadas(fechasReservadas);
    }
  })
  .catch((error) => console.error("Error actualizando lista de reservas:", error));
  
Swal.fire({
  title: "¡Reserva confirmada!",
  text: `Tu reserva del alojamiento ${alojamiento.nombre} ha sido registrada correctamente.`,
  icon: "success",
  confirmButtonText: "Ver mis reservas",
  showCancelButton: true,
  cancelButtonText: "Volver al inicio"
}).then((result) => {
  if (result.isConfirmed) {
    navigate("/perfil");
  } else {
    navigate("/");
  }
});

setMostrarCalendario(false);

} catch (error) {
console.error("Error al realizar la reserva:", error);
console.error("Detalles del error:", error.response ? error.response.data : "No hay detalles adicionales");
console.error("Estado del error:", error.response ? error.response.status : "No hay estado");
*/
import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/ReservaPage.css";
import { useLocation } from "react-router-dom";

const ReservePage = () => {
  const [usuario, setUsuario] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const location = useLocation();
  const { reservaData } = location.state || {};
  const url_base = import.meta.env.VITE_BACKEND_URL;
  


  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
  
    if (token && user && reservaData?.alojamientoId) {
      axios
        .get(`${url_base}/alojamientos/${reservaData.alojamientoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const alojamiento = response.data;
          const imagenesUrl = alojamiento.imagenesUrl || [];  
          console.log("🖼️ Imágenes obtenidas:", imagenesUrl);
          setImagenes(imagenesUrl);
        })
        .catch((error) => {
          console.error("Error al obtener las imágenes del alojamiento:", error);
        });
      setUsuario(localStorage.getItem("user"));
    }
  }, [url_base, reservaData]);


  return (
    <div className="container">
      <h1 className="title">Resumen de tu reserva</h1>
      <div className="card">
        <div className="card-content">
          <h2 className="subtitle">Datos del usuario</h2>
          <p><strong>Nombre:</strong> {reservaData.clienteNombre} {reservaData.clienteApellido}</p>
          <p><strong>Correo:</strong> {reservaData.clienteEmail}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h2 className="subtitle">Detalles del alojamiento</h2>
          <div className="imagenes-container">
            {imagenes.length > 0 ? (
              imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Imagen ${index + 1}`}
                  style={{ width: "100%", height: "auto", margin: "10px" }}
                  onError={(e) => console.error(`❌ Error cargando imagen: ${img}`, e)}
                />
              ))
            ) : (
              <p>No hay imágenes disponibles.</p>
            )}
          </div>
          <p><strong> 🏡 Nombre:</strong> {reservaData.alojamientoNombre}</p>
          <p><strong> 📌 Descripción:</strong> {reservaData.alojamientoDescripcion}</p>
          <p><strong> 📅 Fechas:</strong> {reservaData.fechaDesde} - {reservaData.fechaHasta}</p>
          <p><strong> 🐶🐱 Mascota:</strong> {reservaData.mascotaNombre}</p>
          <p><strong> 💵 Precio:</strong> {reservaData.alojamientoPrecio}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h2 className="subtitle">Políticas</h2>
          <p>Asegúrate de cumplir con todas las normas del alojamiento y revisar las políticas de cancelación.</p>
          <label>
            <input type="checkbox" required /> Acepto las políticas de reserva
          </label>
        </div>
      </div>
      <button className="submit-button">Confirmar reserva</button>
    </div>
  );
}
export default ReservePage;
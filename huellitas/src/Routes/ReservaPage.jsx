import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import axios from "axios";
import Swal from "sweetalert2";
import "../Styles/ReservaPage.css";
import { useLocation } from "react-router-dom";

const ReservePage = () => {
  const [usuario, setUsuario] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const location = useLocation();
  const { reservaData } = location.state || {};
  const url_base = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
 

  useEffect(() => {
  
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
      setUsuario(JSON.parse(localStorage.getItem("user")));
    }
  }, [url_base, reservaData]);


  const handleConfirmarReserva = async () => {
    if (!aceptaPoliticas) {
      Swal.fire({
        icon: "warning",
        title: "Falta aceptar políticas",
        text: "Debes aceptar las políticas de reserva para continuar.",
      });
      return;
    }

    const reservaDataMinimal = {
      fechaDesde: reservaData.fechaDesde,
      fechaHasta: reservaData.fechaHasta,
      mascotaId: reservaData.mascotaId,
      alojamientoId: reservaData.alojamientoId,
      clienteId: usuario.id,
    };
    
    console.log(reservaDataMinimal);

    try {
      const response = await axios.post(
        `${url_base}/reservas`,
        reservaDataMinimal,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reserva confirmada (primer intento):", response);
      setTimeout(() => {
        navigate("/confirmacion", {
          state: {
            reservaData,
          },
        });
      }, 2000);
  
    } catch (errorPost1) {
      console.error("Error en el primer intento de reserva:", errorPost1);
    }
  }; 


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
                  onError={(e) =>
                    console.error(`❌ Error cargando imagen: ${img}`, e)
                  }
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
          <p>
            Asegúrate de cumplir con todas las normas del alojamiento y revisar
            las políticas de cancelación.
          </p>
          <label>
            <input
             type="checkbox"
             checked={aceptaPoliticas}
             onChange={(e) => setAceptaPoliticas(e.target.checked)}
            />{" "}
           Acepto las políticas de reserva
          </label>
        </div>
      </div>
      <button className="submit-button" onClick={handleConfirmarReserva}>
        Confirmar reserva
      </button>
    </div>
  );
}
export default ReservePage;
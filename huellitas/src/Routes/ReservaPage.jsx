


import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/ReservaPage.css";

export default function ReservaPage() {
  const [usuario, setUsuario] = useState(null);
  const [reserva, setReserva] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const url_base = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const userData = JSON.parse(user);
      axios
        .get(`${url_base}/clientes/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsuario(response.data);

          if (response.data.reservas?.length > 0) {
            const ultimaReserva = response.data.reservas[response.data.reservas.length - 1];
            setReserva(ultimaReserva);

            console.log("🔍 Reserva obtenida:", ultimaReserva);
            console.log("🏡 Alojamiento completo:", ultimaReserva.alojamiento);

            //  URLs de imágenes 
            const imagenesUrl = ultimaReserva.alojamiento?.imagenes?.map(img => img.urlImagen) || [];
            
            console.log("🖼️ Imágenes obtenidas:", imagenesUrl);

            setImagenes(imagenesUrl);
          }
        })
        .catch((error) => console.error("❌ Error al obtener los datos del usuario:", error));
    }
  }, [url_base]);

  if (!usuario || !reserva) {
    return (
      <div className="container">
        <h1 className="title">RESUMEN DE TU RESERVA</h1>
        <p>No hay reserva disponible.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Resumen de tu reserva</h1>
      <div className="card">
        <div className="card-content">
          <h2 className="subtitle">Datos del usuario</h2>
          <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
          <p><strong>Correo:</strong> {usuario.email}</p>
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
          <p><strong> 🏡 Nombre:</strong> {reserva.alojamiento.nombre}</p>
          <p><strong> 📌 Descripción:</strong> {reserva.alojamiento.descripcion}</p>
          <p><strong> 📅 Fechas:</strong> {reserva.fechaDesde} - {reserva.fechaHasta}</p>
          <p><strong> 🐶🐱 Mascota:</strong> {reserva.mascota.nombre}</p>
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import axios from "axios";
import Swal from "sweetalert2";
import "../Styles/ReservaPage.css";

export default function ReservaPage() {
  const [usuario, setUsuario] = useState(null);
  const [reserva, setReserva] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const url_base = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); // Inicializar useNavigate

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
            const ultimaReserva =
              response.data.reservas[response.data.reservas.length - 1];
            setReserva(ultimaReserva);

            const imagenesUrl =
              ultimaReserva.alojamiento?.imagenes?.map(
                (img) => img.urlImagen
              ) || [];
            setImagenes(imagenesUrl);
          }
        })
        .catch((error) =>
          console.error("❌ Error al obtener los datos del usuario:", error)
        );
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

  const handleConfirmarReserva = () => {
    // Simulación /d/e confirmaci/ó/n de reserva
    axios
      .post(`${url_base}/reservas/confirmar/`, { reservaId: reserva.id })
      .then(() => {
        navigate("/confirmacion", { state: { reserva, usuario } }); // Redirigir con datos
      })
      .catch((error) => {
        const mensajeError =
          error.response?.data?.message ||
          "Ocurrió un error inesperado en el servidor. Por favor, inténtalo nuevamente.";
        Swal.fire({
          title: "Algo salió mal",
          text: "Hubo un problema al confirmar la reserva. Por favor, inténtalo nuevamente.",
          imageUrl: "/cat1.jpeg",
          imageWidth: 400,
          imageHeight: 300,
          imageAlt: "gatito",
          footer: `<p>${mensajeError}</p>`,
        });
      });
  };

  return (
    <div className="container">
      <h1 className="title">Resumen de tu reserva</h1>
      <div className="card">
        <div className="card-content">
          <h2 className="subtitle">Datos del usuario</h2>
          <p>
            <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
          </p>
          <p>
            <strong>Correo:</strong> {usuario.email}
          </p>
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
          <p>
            <strong> 🏡 Nombre:</strong> {reserva.alojamiento.nombre}
          </p>
          <p>
            <strong> 📌 Descripción:</strong> {reserva.alojamiento.descripcion}
          </p>
          <p>
            <strong> 📅 Fechas:</strong> {reserva.fechaDesde} -{" "}
            {reserva.fechaHasta}
          </p>
          <p>
            <strong> 🐶🐱 Mascota:</strong> {reserva.mascota.nombre}
          </p>
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
            <input type="checkbox" required /> Acepto las políticas de reserva
          </label>
        </div>
      </div>
      <button className="submit-button" onClick={handleConfirmarReserva}>
        Confirmar reserva
      </button>
    </div>
  );
}

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../Styles/Detalle.scss";
import Galeria from "../Components/Detalle/Galeria";


const Detalle = () => {
  const navigate = useNavigate();
  const [alojamiento, setAlojamiento] = useState(1);
  const { id } = useParams();
  console.log(id);
  const url = "/imagenes.json";

  useEffect(() => {
    axios.get(url)
      .then(response => {
        const alojamientoEncontrado = response.data.find(alojamiento => alojamiento.id === parseInt(id));
        setAlojamiento(alojamientoEncontrado || {});
      })
      .catch(error => console.error("Error cargando imágenes:", error));
  }, [id]);
  

  const makeReservation = () => {
    alert("¡Reserva solicitada! Nos pondremos en contacto contigo.");
  };

  return (
    <div>
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Volver
      </button>

      <div className="container-detalle">
        <div className="content">
          <div className="service-container">
            <h2 className="hospedaje-premium">{alojamiento.nombre}</h2>
            <Galeria imagenes={alojamiento.imagenes}/>
            <div className="servicio-detalle">
              <h4>Descripción:</h4>
              {alojamiento.descripcion}
              <div className="servicio-categoria">             
              </div>
            </div>
            <button className="reserve-button" onClick={makeReservation}>
                Reservar ahora
            </button>

          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Detalle;

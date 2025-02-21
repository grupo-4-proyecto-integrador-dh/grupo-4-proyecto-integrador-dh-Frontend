import { useNavigate } from "react-router-dom";
//import AvailabilityTable from "../Components/AvailabilityTable";
import "../Styles/Detalle.scss";
import Galeria from "../Components/Detalle/Galeria";

const Detalle = () => {
  const navigate = useNavigate();

  const makeReservation = () => {
    alert("¡Reserva solicitada! Nos pondremos en contacto contigo.");
  };

  return (
    <div>
      {/*  
      <header className="header">
        <h1 className="title">Hospedaje Premium</h1>
      </header>*/}

      {/* Botón flotante FUERA del header */}
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Volver
      </button>

      <div className="container-detalle">
        <div className="content">
          <div className="service-description">
            <h2 className="hospedaje-premium">Hospedaje Premium para Perros</h2>
            <Galeria />
            <ul className="benefits">
            <p>Este paquete incluye:</p>
              <li>
                <strong>Alojamiento en habitación cómoda y climatizada.</strong>
              </li>
              <li>
                Alimentación personalizada según las necesidades del perro.
              </li>
              <li>3 paseos diarios en zonas seguras.</li>
              <li>Supervisión 24/7 por personal especializado.</li>
              <li>Baño y aseo antes del regreso a casa.</li>
              <li>
                Disponible para <strong>estadías de 3, 5 o 7 días</strong>.
              </li>
              <button className="reserve-button" onClick={makeReservation}>
                Reservar ahora
              </button>
            </ul>
          </div>
        </div>

        {/* <h2 className="table-title">Precios y Disponibilidad</h2>
        <AvailabilityTable />*/}

        
      </div>
    </div>
  );
};

export default Detalle;


import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/ApartadoBusqueda.css";

const ApartadoBusqueda = ({ searchQuery, setSearchQuery, alojamientos = [] }) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const nuevasSugerencias = Array.isArray(alojamientos)
        ? alojamientos.filter((alojamiento) =>
            alojamiento.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

      if (JSON.stringify(nuevasSugerencias) !== JSON.stringify(sugerencias)) {
        setSugerencias(nuevasSugerencias);
      }
    } else {
      if (sugerencias.length > 0) setSugerencias([]);
    }
  }, [searchQuery, alojamientos, sugerencias]);

  return (
    <div className="busqueda-container">
      <div className="busqueda-fechas">
        <DatePicker
          selected={fechaInicio}
          onChange={(date) => setFechaInicio(date)}
          selectsStart
          startDate={fechaInicio}
          endDate={fechaFin}
          placeholderText="Fecha de inicio"
          className="busqueda-input"
        />
        <DatePicker
          selected={fechaFin}
          onChange={(date) => setFechaFin(date)}
          selectsEnd
          startDate={fechaInicio}
          endDate={fechaFin}
          minDate={fechaInicio}
          placeholderText="Fecha de fin"
          className="busqueda-input"
        />
      </div>

      <div className="busqueda-autocompletar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Escribe para buscar..."
          className="busqueda-input"
        />
        {sugerencias.length > 0 && (
          <ul className="busqueda-sugerencias">
            {sugerencias.map((sugerencia, index) => (
              <li key={index}>{sugerencia}</li>
            ))}
          </ul>
        )}
      </div>

      <button className="busqueda-boton">Realizar búsqueda</button>
    </div>
  );
};

ApartadoBusqueda.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  alojamientos: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ApartadoBusqueda;




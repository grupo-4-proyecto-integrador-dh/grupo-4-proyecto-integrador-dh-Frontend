import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/ApartadoBusqueda.css";
import { FaPaw } from "react-icons/fa";

const ApartadoBusqueda = ({ searchQuery, setSearchQuery, alojamientos = [] }) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Filtrar sugerencias usando useMemo para optimizar el cálculo
  const sugerencias = useMemo(() => {
    if (searchQuery.length > 1) {
      return alojamientos.filter((alojamiento) =>
        alojamiento.nombre &&
        searchQuery &&
        alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  }, [searchQuery, alojamientos]);

  // Solo actualizar mostrarSugerencias si hay sugerencias
  useEffect(() => {
    setMostrarSugerencias(sugerencias.length > 0);
  }, [sugerencias]);

  return (
    <div className="busqueda-container">
      <div className="busqueda-input-container">
        <FaPaw className="busqueda-icono" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder=" Buscar alojamiento..."
          className="busqueda-input"
          onFocus={() => setMostrarSugerencias(true)}
          onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
        />
        {mostrarSugerencias && (
          <ul className="busqueda-sugerencias">
            {sugerencias.map((sugerencia, index) => (
              <li key={index} onMouseDown={() => setSearchQuery(sugerencia.nombre)}>
                <span className="busqueda-sugerencia-item">
                  <FaPaw className="sugerencia-icono" />
                  <strong>{sugerencia.nombre}</strong>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="busqueda-fechas">
        <DatePicker
          selected={fechaInicio}
          onChange={(date) => setFechaInicio(date)}
          selectsStart
          startDate={fechaInicio}
          endDate={fechaFin}
          placeholderText="  Fecha de inicio"
          className="busqueda-input"
          dateFormat="MM/dd/yyyy"
          portalId="root-portal"
        />
        <DatePicker
          selected={fechaFin}
          onChange={(date) => setFechaFin(date)}
          selectsEnd
          startDate={fechaInicio}
          endDate={fechaFin}
          minDate={fechaInicio}
          placeholderText="  Fecha de fin"
          className="busqueda-input"
          dateFormat="MM/dd/yyyy"
          portalId="root-portal"
        />
      </div>

      <button className="busqueda-boton">Busqueda</button>
    </div>
  );
};

ApartadoBusqueda.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  alojamientos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ApartadoBusqueda;


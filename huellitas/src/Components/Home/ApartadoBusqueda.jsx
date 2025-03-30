import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/ApartadoBusqueda.css";
import { FaPaw } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ApartadoBusqueda = ({
  searchQuery,
  setSearchQuery,
  alojamientos = [],
}) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showEmptySearchMessage, setShowEmptySearchMessage] = useState(false);
  const navigate = useNavigate();

  // Filtrar sugerencias usando useMemo para optimizar el cálculo
  const sugerenciasMemo = useMemo(() => {
    if (searchQuery.length > 1) {
      const nuevasSugerencias = Array.isArray(alojamientos)
        ? alojamientos.filter((alojamiento) =>
            alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      setSugerencias(nuevasSugerencias);
      setMostrarSugerencias(nuevasSugerencias.length > 0);
      setShowEmptySearchMessage(false);
    } else {
      setSugerencias([]); // 🔹 También corregido aquí
      setMostrarSugerencias(false);
      setShowEmptySearchMessage(false);
    }
  }, [searchQuery, alojamientos]);

  const handleSuggestionClick = (sugerencia) => {
    setSearchQuery(sugerencia.nombre);
    setSelectedSuggestion(sugerencia);
    setMostrarSugerencias(false);
  };

  // Manejar búsqueda
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setShowEmptySearchMessage(true);
    } else if (selectedSuggestion) {
      navigate(`/alojamiento/${selectedSuggestion.id}`);
    }
  };

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
              <li
                key={index}
                onMouseDown={() => handleSuggestionClick(sugerencia)}
              >
                <span className="busqueda-sugerencia-item">
                  <FaPaw className="sugerencia-icono" />
                  <strong>{sugerencia.nombre}</strong>
                </span>
              </li>
            ))}
          </ul>
        )}
        {showEmptySearchMessage && (
          <div className="empty-search-message">
            Por favor, ingrese un alojamiento a buscar.
          </div>
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

      <button className="busqueda-boton" onClick={handleSearch}>
        Búsqueda
      </button>
    </div>
  );
};

ApartadoBusqueda.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  alojamientos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ApartadoBusqueda;

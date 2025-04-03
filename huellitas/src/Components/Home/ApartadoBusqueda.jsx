import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/ApartadoBusqueda.css";
import { FaPaw } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { es } from "date-fns/locale";
import Swal from "sweetalert2";

const ApartadoBusqueda = ({ searchQuery, setSearchQuery, alojamientos = [], filteredAlojamientos, setFilteredAlojamientos}) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showEmptySearchMessage, setShowEmptySearchMessage] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [reservas, setReservas] = useState([])
  const navigate = useNavigate();
  
  const fetchReservas = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/reservas`);
      if (response.ok) {
        const data = await response.json();
        // Filtrar las reservas no canceladas
        const reservasActivas = data.filter((reserva) => reserva.estado !== "CANCELADA");
        return reservasActivas;
      } else {
        throw new Error("Error al obtener las reservas.");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  useEffect(() => {
    // Llamar a fetchReservas y esperar su resultado
    const obtenerReservas = async () => {
      const reservasdisponibles = await fetchReservas();
      setReservas(reservasdisponibles);
      console.log(reservasdisponibles); // Verificar las reservas obtenidas
    };
  
    obtenerReservas(); // Llamar a la función asincrónica dentro de useEffect
  }, []);
  

  // Filtrar sugerencias usando useMemo para optimizar el cálculo
  const sugerenciasMemo = useMemo(() => {
    console.log(searchQuery)
    if (searchQuery.length > 1) {
      const nuevasSugerencias = Array.isArray(alojamientos)
        ? alojamientos.filter((alojamiento) =>
            alojamiento.nombre && searchQuery &&
            alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      setSugerencias(nuevasSugerencias);
      setMostrarSugerencias(nuevasSugerencias.length > 0);
      setShowEmptySearchMessage(false); 
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
      setShowEmptySearchMessage(false); 
    }
  }, [searchQuery, alojamientos]);

  const handleSuggestionClick = (sugerencia) => {
    setSearchQuery(sugerencia.nombre);
    setSelectedSuggestion(sugerencia);
    setMostrarSugerencias(false);
  };
  

  const handleSearch = async () => {
    // Verificar si el campo de búsqueda está vacío
    if (searchQuery.trim() === "") {
      setShowEmptySearchMessage(true);
    } else if (selectedSuggestion) {
      const alojamiento = selectedSuggestion; // El alojamiento seleccionado
    
      // Verificar si las fechas están vacías
      if (!fechaInicio || !fechaFin) {
        alert("Por favor, seleccione las fechas de inicio y fin.");
        return; // No hacer nada si las fechas están vacías
      }
    
      // Obtener las reservas asociadas al alojamiento
      const reservas = await fetchReservas(alojamiento.id);
    
      // Filtrar las reservas activas que se solapan con las fechas seleccionadas
      const reservasSolapadas = reservas.filter((reserva) => {
        const reservaInicio = new Date(reserva.fechaDesde);
        const reservaFin = new Date(reserva.fechaHasta);
        const fechaInicioSeleccionada = new Date(fechaInicio);
        const fechaFinSeleccionada = new Date(fechaFin);
  
        // Comprobar si las fechas seleccionadas se solapan con alguna reserva activa
        return !(
          fechaInicioSeleccionada > reservaFin || fechaFinSeleccionada < reservaInicio
        );
      });
  
      // Si hay reservas solapadas, no se puede proceder con la búsqueda
      if (reservasSolapadas.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El alojamiento seleccionado no se encuentra disponible para esas fechas",
          timer: 2000
        });
      } else {
        // Redirigir al detalle del alojamiento si las fechas son válidas
        navigate(`/alojamiento/${selectedSuggestion.id}`);
      }
    }
  };


 useEffect(() => {
  if (fechaInicio && fechaFin) {
    // Convertir fechas seleccionadas a Date para comparación
    const fechaInicioSeleccionada = new Date(fechaInicio);
    const fechaFinSeleccionada = new Date(fechaFin);

    // Obtener IDs de alojamientos con reservas solapadas
    const alojamientosOcupados = new Set(
      reservas
        .filter((reserva) => {
          const reservaInicio = new Date(reserva.fechaDesde);
          const reservaFin = new Date(reserva.fechaHasta);
          return !(fechaInicioSeleccionada > reservaFin || fechaFinSeleccionada < reservaInicio);
        })
        .map((reserva) => reserva.alojamientoId) // Extraemos solo los IDs
    );

    // Filtrar alojamientos disponibles
    setFilteredAlojamientos(alojamientos.filter(
      (alojamiento) =>
        (searchQuery.trim() === "" || alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !alojamientosOcupados.has(alojamiento.id) // Verificamos si el ID está en el Set
    ));

    console.log("Alojamientos filtrados: ", filteredAlojamientos);
  }
}, [fechaInicio, fechaFin, alojamientos, searchQuery, reservas]);

  

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
              <li key={index} onClick={() => handleSuggestionClick(sugerencia)}>
                <span className="busqueda-sugerencia-item">
                  <FaPaw className="sugerencia-icono" />
                  <strong>{sugerencia.nombre}</strong>
                </span>
              </li>
            ))}
          </ul>
        )}
        {showEmptySearchMessage && (
          <div className="empty-search-message">Por favor, ingrese un alojamiento a buscar.</div>
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
          dateFormat="dd/MM/yyyy"
          portalId="root-portal"
          locale={es} 
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
          dateFormat="dd/MM/yyyy"
          portalId="root-portal"
          locale={es} 
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


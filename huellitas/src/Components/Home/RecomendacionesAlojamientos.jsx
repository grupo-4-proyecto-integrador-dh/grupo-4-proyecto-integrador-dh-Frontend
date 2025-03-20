
import { useState, useEffect } from "react";
import Card from "../Home/CardRecomendaciones";
import PropTypes from "prop-types";

const RecomendacionesAlojamientos = ({ searchQuery, setSuggestions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [alojamientos, setAlojamientos] = useState([]);
  const [filteredAlojamientos, setFilteredAlojamientos] = useState([]);
  const cardsPerPage = 5;

  useEffect(() => {
    const fetchAlojamientos = async () => {
      try {
        const response = await fetch("https://insightful-patience-production.up.railway.app/alojamientos");
        const data = await response.json();

        const shuffledAlojamientos = data.sort(() => Math.random() - 0.5);
        setAlojamientos(shuffledAlojamientos);
        setFilteredAlojamientos(shuffledAlojamientos);
      } catch (error) {
        console.error("Error al obtener los alojamientos:", error);
      }
    };

    fetchAlojamientos();
  }, []);

  useEffect(() => {
    if (props.searchQuery && props.searchQuery.length > 0) {
      const filtered = alojamientos.filter((alojamiento) =>
        alojamiento.nombre.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
      setFilteredAlojamientos(filtered);
    } else {
      setFilteredAlojamientos(alojamientos);
    }
    setCurrentPage(1);
  }, [props.searchQuery, alojamientos]);

  const totalPages = Math.ceil(filteredAlojamientos.length / cardsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const renderCards = () => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return filteredAlojamientos.slice(startIndex, endIndex).map((alojamiento) => (
      <Card
        key={alojamiento.id}
        id={alojamiento.id}
        title={alojamiento.nombre}
        description={alojamiento.descripcion}
        price={alojamiento.precio}
        imagenes={alojamiento.imagenes}
        alojamiento={alojamiento} // Pasa el objeto alojamiento completo
      />
    ));
  };

  return (
    <main className="main__recomendaciones">
      <h1>Recomendaciones</h1>
      <section className="main__recomendaciones__grid">
        {filteredAlojamientos.length ? renderCards() : <p>No se han encontrado resultados</p>}
      </section>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </main>
  );
};


RecomendacionesAlojamientos.propTypes = {
  searchQuery: PropTypes.string,
  setSuggestions: PropTypes.func.isRequired,
};


RecomendacionesAlojamientos.defaultProps = {
  searchQuery: "",
  setSuggestions: () => {}, 
};

export default RecomendacionesAlojamientos;
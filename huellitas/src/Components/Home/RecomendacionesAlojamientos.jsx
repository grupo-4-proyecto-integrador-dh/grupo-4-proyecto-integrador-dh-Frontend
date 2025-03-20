import { useState, useEffect } from "react";
import Card from "../Home/CardRecomendaciones";

const RecomendacionesAlojamientos = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [alojamientos, setAlojamientos] = useState([]);
  const [filteredAlojamientos, setFilteredAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsPerPage = 5;

  useEffect(() => {
    const fetchAlojamientos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://insightful-patience-production.up.railway.app/alojamientos");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const shuffledAlojamientos = data.sort(() => Math.random() - 0.5);
        setAlojamientos(shuffledAlojamientos);
        setFilteredAlojamientos(shuffledAlojamientos);
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener los alojamientos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlojamientos();
  }, []);

  useEffect(() => {
    let filtered = alojamientos;

    if (props.searchQuery && props.searchQuery.length > 0) {
      filtered = alojamientos.filter((alojamiento) =>
        alojamiento.nombre.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
    }

    if (props.selectedCategory) {
      filtered = filtered.filter((alojamiento) =>
        alojamiento.categoria.id === props.selectedCategory
      );
    }

    setFilteredAlojamientos(filtered);
    setCurrentPage(1);
  }, [props.searchQuery, props.selectedCategory, alojamientos]);

  const totalPages = Math.ceil(filteredAlojamientos.length / cardsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const renderCards = () => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, filteredAlojamientos.length);
    return filteredAlojamientos.slice(startIndex, endIndex).map((alojamiento) => (
      <Card
        key={alojamiento.id}
        id={alojamiento.id}
        title={alojamiento.nombre}
        description={alojamiento.descripcion}
        price={alojamiento.precio}
        imagenes={alojamiento.imagenes}
        alojamiento={alojamiento}
      />
    ));
  };

  if (loading) {
    return <p>Cargando recomendaciones...</p>;
  }

  if (error) {
    return <p>Error al cargar las recomendaciones: {error}</p>;
  }

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

export default RecomendacionesAlojamientos;
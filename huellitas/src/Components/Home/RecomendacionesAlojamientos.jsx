import { useState, useEffect } from "react";
import Card from "../Home/CardRecomendaciones";

const RecomendacionesAlojamientos = ({ selectedCategories, searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [alojamientos, setAlojamientos] = useState([]);
  const [filteredAlojamientos, setFilteredAlojamientos] = useState([]);
  const [totalAlojamientos, setTotalAlojamientos] = useState(0);
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
        setTotalAlojamientos(shuffledAlojamientos.length);
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


    if (searchQuery && searchQuery.length > 0) {
      filtered = filtered.filter((alojamiento) =>
        alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    if (selectedCategories && selectedCategories.length > 0) {
      filtered = filtered.filter((alojamiento) =>
        alojamiento.categoria && selectedCategories.includes(alojamiento.categoria.id)
      );
    }


    setFilteredAlojamientos(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, alojamientos]);

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
      <p>
        Mostrando {filteredAlojamientos.length} de {totalAlojamientos} alojamientos
      </p>
      <section className="main__recomendaciones__grid">
        {filteredAlojamientos.length ? renderCards() : <p>No se han encontrado resultados</p>}
      </section>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>
      )}
    </main>
  );
};

export default RecomendacionesAlojamientos;

import { useState, useEffect } from "react";
import Card from "../Home/CardRecomendaciones";
import PropTypes from "prop-types";

<<<<<<< HEAD
const RecomendacionesAlojamientos = ({ selectedCategories, searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
=======
const RecomendacionesAlojamientos = ({ searchQuery, setSuggestions }) => {
>>>>>>> 9bfd3ba8d64ef8ae046127344ca61ba5b97565b3
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
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/alojamientos");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
<<<<<<< HEAD
        const shuffledAlojamientos = data.sort(() => Math.random() - 0.5);
        setAlojamientos(shuffledAlojamientos);
        setTotalAlojamientos(shuffledAlojamientos.length);
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener los alojamientos:", err);
      } finally {
        setLoading(false);
=======
        setAlojamientos(data);
        setFilteredAlojamientos(data);
      } catch (error) {
        console.error("Error fetching alojamientos:", error);
>>>>>>> 9bfd3ba8d64ef8ae046127344ca61ba5b97565b3
      }
    };

    fetchAlojamientos();
  }, []);

<<<<<<< HEAD

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
=======
  useEffect(() => {
    if (!searchQuery) {
      setFilteredAlojamientos(alojamientos);
      setSuggestions([]);
      return;
    }

    const filtered = alojamientos.filter((alojamiento) =>
      alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredAlojamientos(filtered);
    setSuggestions(filtered.map((alojamiento) => alojamiento.nombre));
  }, [searchQuery, alojamientos, setSuggestions]);
>>>>>>> 9bfd3ba8d64ef8ae046127344ca61ba5b97565b3

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
<<<<<<< HEAD
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
=======
        {filteredAlojamientos.length ? (
          filteredAlojamientos.map((alojamiento) => (
            <Card
              key={alojamiento.id}
              id={alojamiento.id}
              title={alojamiento.nombre}
              description={alojamiento.descripcion}
              price={alojamiento.precio}
              imagenes={alojamiento.imagenes}
            />
          ))
        ) : (
          <p>No se han encontrado resultados</p>
        )}
      </section>
>>>>>>> 9bfd3ba8d64ef8ae046127344ca61ba5b97565b3
    </main>
  );
};

RecomendacionesAlojamientos.propTypes = {
  searchQuery: PropTypes.string,
  setSuggestions: PropTypes.func, // Cambia a no requerido
};

<<<<<<< HEAD
RecomendacionesAlojamientos.defaultProps = {
  searchQuery: "",
  setSuggestions: () => {}, // Define un valor por defecto
};

=======
>>>>>>> 9bfd3ba8d64ef8ae046127344ca61ba5b97565b3
export default RecomendacionesAlojamientos;

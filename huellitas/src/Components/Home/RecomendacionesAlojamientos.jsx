
import { useState, useEffect } from "react";
import Card from "../Home/CardRecomendaciones";
import PropTypes from "prop-types";

const RecomendacionesAlojamientos = ({ searchQuery, setSuggestions }) => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [filteredAlojamientos, setFilteredAlojamientos] = useState([]);

  useEffect(() => {
    const fetchAlojamientos = async () => {
      try {
        const response = await fetch("https://insightful-patience-production.up.railway.app/alojamientos");
        const data = await response.json();
        setAlojamientos(data);
        setFilteredAlojamientos(data);
      } catch (error) {
        console.error("Error fetching alojamientos:", error);
      }
    };
    fetchAlojamientos();
  }, []);

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

  return (
    <main className="main__recomendaciones">
      <section className="main__recomendaciones__grid">
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
    </main>
  );
};

RecomendacionesAlojamientos.propTypes = {
  searchQuery: PropTypes.string,
  setSuggestions: PropTypes.func.isRequired,
};

export default RecomendacionesAlojamientos;

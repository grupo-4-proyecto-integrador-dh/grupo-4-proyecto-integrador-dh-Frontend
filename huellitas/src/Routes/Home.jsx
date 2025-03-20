import ApartadoBusqueda from "../Components/Home/ApartadoBusqueda";
import CategoriasAlojamientos from "../Components/Home/CategoriasAlojamientos";
import RecomendacionesAlojamientos from "../Components/Home/RecomendacionesAlojamientos";
import { useState, useEffect } from "react";
import "../Styles/App.css";
import "../Styles/Home.scss";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [alojamientos, setAlojamientos] = useState([]);
  const [filteredAlojamientos, setFilteredAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para la carga

  useEffect(() => {
    const fetchAlojamientos = async () => {
      setLoading(true); // Inicia la carga
      try {
        const response = await axios.get("https://insightful-patience-production.up.railway.app/alojamientos");
        setAlojamientos(response.data);
        setFilteredAlojamientos(response.data);
      } catch (error) {
        console.error("Error al cargar los alojamientos:", error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchAlojamientos();
  }, []);

  useEffect(() => {
    let filtered = alojamientos;

    if (searchQuery && searchQuery.length > 0) {
      filtered = alojamientos.filter((alojamiento) =>
        alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((alojamiento) =>
        alojamiento.categoria.id === selectedCategory
      );
    }

    setFilteredAlojamientos(filtered);
    console.log("Alojamiento filtrados", filtered.length); // Verifico los alojamientos filtrados
  }, [searchQuery, selectedCategory, alojamientos]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return <p>Cargando alojamientos...</p>; // Mensaje de carga
  }

  return (
    <div className="w-100">
      <ApartadoBusqueda
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <CategoriasAlojamientos
        onCategoryClick={handleCategoryClick}
        onClearCategoryFilter={handleClearCategoryFilter}
        totalProducts={alojamientos.length}
        filteredProducts={filteredAlojamientos.length}
      />
      <RecomendacionesAlojamientos
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default Home;
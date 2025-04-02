import React, { useState, useEffect } from "react";
import axios from "axios";
import ApartadoBusqueda from "../Components/Home/ApartadoBusqueda";
import CategoriasAlojamientos from "../Components/Home/CategoriasAlojamientos";
import RecomendacionesAlojamientos from "../Components/Home/RecomendacionesAlojamientos";
import "../Styles/App.css";
import "../Styles/Home.scss";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [alojamientos, setAlojamientos] = useState([]);
  const [filteredAlojamientos, setFilteredAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlojamientos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/alojamientos");
        setAlojamientos(response.data);
      } catch (error) {
        console.error("Error al cargar los alojamientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlojamientos();
  }, []);

  useEffect(() => {
    let filtered = alojamientos;
  
    if (searchQuery) {
      filtered = filtered.filter((alojamiento) =>
        alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((alojamiento) =>
        selectedCategories.some((cat) => cat.id === alojamiento.categoria.id)
      );
    }
  
    setFilteredAlojamientos((prevFiltered) => {
      if (JSON.stringify(prevFiltered) !== JSON.stringify(filtered)) {
        return filtered;
      }
      return prevFiltered;
    });
  
    console.log("Alojamientos filtrados", filtered.length);
  }, [searchQuery, selectedCategories, alojamientos]);
  
  
  const handleCategoryClick = (category) => {
    setSelectedCategories((prevCategories) => {
      const isSelected = prevCategories.some((cat) => cat.id === category.id);
      return isSelected
        ? prevCategories.filter((cat) => cat.id !== category.id) // Quitar si ya está
        : [...prevCategories, category]; // Agregar si no estaba
    });
  }

  const handleClearCategoryFilter = () => {
    setSelectedCategories([]);
  };

  if (loading) {
    return <p>Cargando alojamientos...</p>;
  }

  return (
    <div className="w-100">
      <ApartadoBusqueda
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        alojamientos={alojamientos}
      />
      <CategoriasAlojamientos
        onCategoryClick={handleCategoryClick}
        onClearCategoryFilter={handleClearCategoryFilter}
        selectedCategories={selectedCategories}
      />
      <RecomendacionesAlojamientos
        filteredAlojamientos={filteredAlojamientos}
        selectedCategories={selectedCategories}
      />
    </div>
  );
};

export default Home;

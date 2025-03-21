import React, { useState, useEffect } from "react";
import axios from "axios";
import ApartadoBusqueda from "../Components/Home/ApartadoBusqueda";
import CategoriasAlojamientos from "../Components/Home/CategoriasAlojamientos";
import RecomendacionesAlojamientos from "../Components/Home/RecomendacionesAlojamientos";
import "../Styles/App.css";
import "../Styles/Home.scss";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [alojamientos, setAlojamientos] = useState([]);
  const [filteredAlojamientos, setFilteredAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlojamientos = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://insightful-patience-production.up.railway.app/alojamientos");
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


    if (selectedCategory) {
      filtered = filtered.filter((alojamiento) =>
        alojamiento.categoria.id === selectedCategory.id
      );
    }

    setFilteredAlojamientos(filtered);
    console.log("Alojamientos filtrados", filtered.length);
  }, [searchQuery, selectedCategory, alojamientos]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return <p>Cargando alojamientos...</p>;
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
        selectedCategory={selectedCategory}
      />
      <RecomendacionesAlojamientos
        filteredAlojamientos={filteredAlojamientos}
        selectedCategories={selectedCategory ? [selectedCategory] : []}
      />
    </div>
  );
};

export default Home;

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
    console.log(searchQuery);
    let filtered = alojamientos;
  
    if (searchQuery) {
      filtered = filtered.filter((alojamiento) =>
        alojamiento.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((alojamiento) =>
        selectedCategories.includes(alojamiento.categoria.id)
      );
    }
  
    setFilteredAlojamientos(filtered);
    console.log(filteredAlojamientos)
  
    console.log("Alojamientos filtrados", filtered.length);
    console.log("Categorías seleccionadas", selectedCategories);
  }, [searchQuery, selectedCategories, alojamientos]);
  
  const handleCategoryClick = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const isSelected = prevCategories.includes(categoryId);
      return isSelected
        ? prevCategories.filter((id) => id !== categoryId) // Quitar si ya está
        : [...prevCategories, categoryId]; // Agregar si no estaba
    });
  };
  
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
        setFilteredAlojamientos={setFilteredAlojamientos}
        selectedCategories={selectedCategories}
      />
    </div>
  );
};

export default Home;

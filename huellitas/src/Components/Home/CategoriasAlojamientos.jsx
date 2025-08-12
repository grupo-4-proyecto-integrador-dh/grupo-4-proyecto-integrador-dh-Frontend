import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import CategoriaCard from "./CategoriaCard";
import "../../Styles/Home.scss";

const CategoriasAlojamientos = ({ onCategoryClick, onClearCategoryFilter, selectedCategories }) => {
  const [categorias, setCategorias] = useState([]);
  const [alojamientos, setAlojamientos] = useState([]);
  const [categoriasConCantidad, setCategoriasConCantidad] = useState([]);
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const itemsPerPage = window.innerWidth < 768 ? 1 : 3;
  const cardWidthWithGap = 196; // 180px card width + 16px gap

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/categorias"
        );
        console.log("Raw categories data:", response.data);
        setCategorias(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchAlojamientos = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/alojamientos"
        );
        setAlojamientos(response.data);
      } catch (error) {
        console.error("Error al cargar los alojamientos:", error);
      }
    };

    fetchCategorias();
    fetchAlojamientos();
  }, []);

  useEffect(() => {
    if (categorias.length > 0 && alojamientos.length > 0) {
      console.log("Processing categories with alojamientos");
      
      const conteoAlojamientos = alojamientos.reduce((acc, alojamiento) => {
        if (alojamiento.categoria && alojamiento.categoria.id) {
          const categoriaId = alojamiento.categoria.id;
          acc[categoriaId] = (acc[categoriaId] || 0) + 1;
        }
        return acc;
      }, {});

      const nuevasCategorias = categorias.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        imagenUrl: categoria.imagenUrl,
        alojamientosCount: conteoAlojamientos[categoria.id] || 0
      }));

      console.log("Categorías procesadas:", nuevasCategorias);
      setCategoriasConCantidad(nuevasCategorias);
    }
  }, [categorias, alojamientos]); // Only depend on raw data, not derived state

  useEffect(() => {
    if (categorias.length > 0) {
      console.log("Processing categories:", categorias);
      console.log("Current categoriasConCantidad:", categoriasConCantidad);
      console.log("Current transform value:", -index * cardWidthWithGap);
    }
  }, [categorias, categoriasConCantidad, index]);

  const nextSlide = () => {
    if (index < categorias.length - itemsPerPage) {
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleCardClick = (categoryId) => {
    onCategoryClick(categoryId);
  };

  const handleClearLocalFilter = () => {
    onClearCategoryFilter();
  };

  // Agregado para manejar el estado de carga
  if (categoriasConCantidad.length === 0) {
    return (
      <section className="main__categorias">
        <div className="categorias__header">
          <h2>Categorías</h2>
        </div>
        <div className="carousel-container">
          <p>Cargando categorías...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="main__categorias">
      <div className="categorias__header">
        <h2>Categorías</h2>
        {selectedCategories.length > 0 && ( // Solo muestra el botón si hay categorías seleccionadas
        <button className="clear-filter-btn" onClick={handleClearLocalFilter}>
          Borrar Filtros
        </button>
         )}
      </div>

      <div className="carousel-container">
        <button 
          className="prev-btn" 
          onClick={prevSlide} 
          disabled={index === 0}
        >
          <p>‹</p>
        </button>

        <div className="carousel-slider">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * cardWidthWithGap}px)`,
              display: 'flex',
              gap: '1rem',
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {categoriasConCantidad.map((categoria) => (
              <CategoriaCard
                key={categoria.id}
                nombre={categoria.nombre}
                imagen={categoria.imagenUrl}
                alt={`Categoría ${categoria.nombre}`}
                cantidad={categoria.alojamientosCount || 0}
                onClick={() => handleCardClick(categoria.id)}
                isSelected={selectedCategories.includes(categoria.id)}
              />
            ))}
          </div>
        </div>

        <button
          className="next-btn"
          onClick={nextSlide}
          disabled={index >= categoriasConCantidad.length - itemsPerPage}
        >
          <p>›</p>
        </button>
      </div>
    </section>
  );
};

CategoriasAlojamientos.propTypes = {
  onCategoryClick: PropTypes.func.isRequired,
  onClearCategoryFilter: PropTypes.func.isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.number).isRequired, // Changed from PropTypes.object
};


export default CategoriasAlojamientos;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import CategoriaCard from "./CategoriaCard";
import "../../Styles/Home.scss";

const CategoriasAlojamientos = ({ onCategoryClick, onClearCategoryFilter, selectedCategory }) => {
  const [categorias, setCategorias] = useState([]);
  const [alojamientos, setAlojamientos] = useState([]);
  const [categoriasConCantidad, setCategoriasConCantidad] = useState([]);
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const itemsPerPage = 3;
  const cardWidthWithGap = 196;


    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/categorias");
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
            }
        };

        const fetchAlojamientos = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/alojamientos");
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
      const conteoAlojamientos = alojamientos.reduce((acc, alojamiento) => {
        if (alojamiento.categoria && alojamiento.categoria.id) {
          const categoriaId = alojamiento.categoria.id;
          acc[categoriaId] = (acc[categoriaId] || 0) + 1;
        }
        return acc;
      }, {});
  
      const nuevasCategorias = categorias.map((categoria) => ({
        ...categoria,
        alojamientosCount: conteoAlojamientos[categoria.id] || 0,
      }));
  
      setCategoriasConCantidad(nuevasCategorias);
    }
  }, [categorias, alojamientos]);


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

  return (
    <section className="main__categorias">
      <div className="categorias__header">
        <h2>Categorías</h2>
        {selectedCategory && (
          <button className="clear-filter-btn" onClick={handleClearLocalFilter}>
            Borrar Filtros
          </button>
        )}
      </div>
  
      <div className="carousel-container">
        <button className="prev-btn" onClick={prevSlide} disabled={index === 0}>‹</button>
  
        <div className="carousel-slider" ref={sliderRef}>
          <div className="carousel-track" style={{ transform: `translateX(-${index * cardWidthWithGap}px)` }}>
            {categoriasConCantidad.map((categoria) => (
              <CategoriaCard
                key={categoria.id}
                nombre={categoria.nombre}
                imagen={categoria.imagenUrl || "/imagenes/default.jpg"}
                alt={`Imagen de ${categoria.nombre}`}
                cantidad={categoria.alojamientosCount}
                onClick={() => handleCardClick(categoria.id)}
                isSelected={selectedCategory?.id === categoria.id}
              />
            ))}
          </div>
        </div>
  
        <button className="next-btn" onClick={nextSlide} disabled={index >= categorias.length - itemsPerPage}>›</button>
      </div>
    </section>
  );
};


CategoriasAlojamientos.propTypes = {
  onCategoryClick: PropTypes.func.isRequired,
  onClearCategoryFilter: PropTypes.func.isRequired,
  selectedCategory: PropTypes.object,
};

export default CategoriasAlojamientos;

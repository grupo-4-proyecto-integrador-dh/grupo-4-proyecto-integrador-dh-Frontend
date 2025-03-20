import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CategoriaCard from "./CategoriaCard";
import "../../Styles/Home.scss";

const CategoriasCarousel = () => {
    const [categorias, setCategorias] = useState([]);
    const [alojamientos, setAlojamientos] = useState([]);
    const sliderRef = useRef(null);
    const [index, setIndex] = useState(0);
    const itemsPerPage = 3;
    const cardWidthWithGap = 196;

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get("https://insightful-patience-production.up.railway.app/categorias");
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
            }
        };

        const fetchAlojamientos = async () => {
            try {
                const response = await axios.get("https://insightful-patience-production.up.railway.app/alojamientos"); // Reemplaza con la URL correcta
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
            const categoriasConCantidad = categorias.map((categoria) => {
                const cantidad = alojamientos.filter(
                    (alojamiento) => alojamiento.categoria.id === categoria.id
                ).length;
                return { ...categoria, alojamientosCount: cantidad };
            });
            setCategorias(categoriasConCantidad);
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

    return (
        <section className="main__categorias">
            <h2>Categorías de Alojamientos</h2>
            <div className="carousel-container">
                <button className="prev-btn" onClick={prevSlide} disabled={index === 0}>‹</button>
                
                <div className="carousel-slider" ref={sliderRef}>
                    <div
                        className="carousel-track"
                        style={{ transform: `translateX(-${index * cardWidthWithGap}px)` }}
                    >
                        {categorias.map((categoria) => (
                            <CategoriaCard
                                key={categoria.id}
                                nombre={categoria.nombre}
                                imagen={categoria.imagenUrl || "/imagenes/default.jpg"}
                                alt={`Imagen de ${categoria.nombre}`}
                                cantidad={categoria.alojamientosCount}
                            />
                        ))}
                    </div>
                </div>

                <button className="next-btn" onClick={nextSlide} disabled={index >= categorias.length - itemsPerPage}>›</button>
            </div>
        </section>
    );
};

export default CategoriasCarousel;
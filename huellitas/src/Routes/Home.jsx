import React, { useState, useEffect } from "react";
import productos from "../productos"; // Asegúrate de la ruta correcta
import Card from "../Components/Card";

const Home = () => {
  const [productosAleatorios, setProductosAleatorios] = useState([]);

  useEffect(() => {
    const obtenerProductosAleatorios = () => {
      let copiaProductos = [...productos];
      let seleccionados = [];

      while (seleccionados.length < 10 && copiaProductos.length > 0) {
        const indexAleatorio = Math.floor(Math.random() * copiaProductos.length);
        seleccionados.push(copiaProductos[indexAleatorio]);
        copiaProductos.splice(indexAleatorio, 1); // Elimina el producto para evitar repetición
      }

      setProductosAleatorios(seleccionados);
    };

    obtenerProductosAleatorios();
  }, []);

  return (
    <div className="grid-container">
      {productosAleatorios.map((producto) => (
        <Card key={producto.id} producto={producto} />
      ))}
    </div>
  );
};

export default Home;

import React from "react";
import productos from "../productos"; // Asegúrate de que los productos están en un array
import "../Styles/App.css";

const Home = () => {
  // Mezcla los productos de forma aleatoria y toma los primeros 10
  const productosAleatorios = [...productos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <div className="grid-container">
      {productosAleatorios.map((producto) => (
        <div className="card" key={producto.id}>
          <img src={producto.imagen} alt={producto.nombre} />
          <h3>{producto.nombre}</h3>
          <p>{producto.descripcion}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;

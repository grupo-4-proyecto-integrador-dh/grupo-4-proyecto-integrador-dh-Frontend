/* eslint-disable react/prop-types */
import React from "react";

const Card = ({ producto }) => {
  return (
    <div className="card">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>{producto.precio}</p>
    </div>
  );
};

export default Card;


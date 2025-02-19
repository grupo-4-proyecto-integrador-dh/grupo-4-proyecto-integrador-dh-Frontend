//import React from "react";

const AvailabilityTable = () => {
  const disponibilidad = [
    { duracion: "3 días", precio: "$80", disponible: "Disponible" },
    { duracion: "5 días", precio: "$120", disponible: "Disponible" },
    { duracion: "7 días", precio: "$150", disponible: "Pocas plazas" }
  ];

  return (
    <table className="pricing-table">
      <thead>
        <tr>
          <th>Duración</th>
          <th>Precio</th>
          <th>Disponibilidad</th>
        </tr>
      </thead>
      <tbody>
        {disponibilidad.map((item, index) => (
          <tr key={index}>
            <td>{item.duracion}</td>
            <td>{item.precio}</td>
            <td>{item.disponible}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AvailabilityTable;

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Calendario = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h3>Selecciona una fecha</h3>
      <Calendar onChange={setDate} value={date} />
      <p>Fecha seleccionada: {date.toLocaleDateString("es-ES")}</p>
    </div>
  );
};

export default Calendario;
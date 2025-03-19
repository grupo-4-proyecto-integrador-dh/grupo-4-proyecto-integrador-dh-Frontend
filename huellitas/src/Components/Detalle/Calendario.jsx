import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Calendario = ({mensaje}) => {
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  date2.setMonth(date1.getMonth() + 1);
 
  return (
    <div className="calendario-disponibilidad">
      <h3  className="calendario-titulo">{mensaje}</h3>
      <div className="calendario-disponibilidad-a"><Calendar onChange={setDate1} value={date1} /></div>
      <div className="calendario-disponibilidad-b"><Calendar onChange={setDate2} value={date2} /></div>
      <p>Fecha seleccionada: {date1.toLocaleDateString("es-ES")}</p>
    </div>
  );
};

export default Calendario;
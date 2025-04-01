import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Styles/Detalle/Calendario.scss";

const Calendario = ({ mensaje, onChange, fechasReservadas }) => {
  const [fechas, setFechas] = useState([null, null]);
  const [fechaTemporal, setFechaTemporal] = useState(null);

  const hoy = new Date();
  const mesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const mesSiguiente = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);

  const handleDateChange = (fechaSeleccionada) => {
    if (!fechas[0]) {
      setFechas([fechaSeleccionada, null]);
      setFechaTemporal(fechaSeleccionada);
    } else if (!fechas[1]) {
      const nuevaFechaInicio =
        fechaSeleccionada < fechas[0] ? fechaSeleccionada : fechas[0];
      const nuevaFechaFin =
        fechaSeleccionada < fechas[0] ? fechas[0] : fechaSeleccionada;
      setFechas([nuevaFechaInicio, nuevaFechaFin]);
      onChange([nuevaFechaInicio, nuevaFechaFin]);
      setFechaTemporal(null);
    } else {
      setFechas([fechaSeleccionada, null]);
      setFechaTemporal(fechaSeleccionada);
    }
  };

  const isFechaReservada = ({ date }) => {
    return fechasReservadas.some((reserva) => {
      const fecha = date.getTime();
      const inicio = reserva.fechaInicio.getTime();
      const fin = reserva.fechaFin.getTime();
      return fecha >= inicio && fecha <= fin;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (date <= hoy) {
        return "fecha-pasada";
      }
      if (fechas[0] && fechas[1]) {
        const fecha = date.getTime();
        const inicio = fechas[0].getTime();
        const fin = fechas[1].getTime();
        if (fecha >= inicio && fecha <= fin) {
          return "rango-seleccionado";
        }
      }
    }
    return null;
  };

  return (
    <div className="calendario-disponibilidad">
      <h3 className="calendario-titulo">{mensaje}</h3>
      <div
        className="calendario-disponibilidad-a"
        style={{ display: "flex", gap: "20px" }}
      >
        <div>
          <Calendar
            onChange={handleDateChange}
            value={fechaTemporal}
            selectRange={false}
            tileDisabled={isFechaReservada}
            tileClassName={tileClassName} // Aplicar estilos personalizados
            minDate={hoy} // Restringir fechas anteriores a hoy
            defaultActiveStartDate={mesActual}
            showFixedNumberOfWeeks
          />
        </div>
        <div>
          <Calendar
            onChange={handleDateChange}
            value={fechaTemporal}
            selectRange={false}
            tileDisabled={isFechaReservada}
            tileClassName={tileClassName} // Aplicar estilos personalizados
            minDate={hoy} // Restringir fechas anteriores a hoy
            defaultActiveStartDate={mesSiguiente}
            showFixedNumberOfWeeks
          />
        </div>
      </div>
    </div>
  );
};

export default Calendario;

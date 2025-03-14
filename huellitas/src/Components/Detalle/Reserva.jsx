import React, { useState, useEffect } from "react";
import Calendario from "./Calendario";

function Reserva() {
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();
    setToday(`${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`);
  }, []);

  return (
    <div>
      <p className="d-inline-flex gap-1">
        <a className="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
          Reserva ahora
        </a>
      </p>
      <div className="collapse" id="collapseExample">
        <div className="disponibilidad">
          <Calendario />
          <Calendario />
        </div>
      </div>
    </div>
  );
}

export default Reserva;

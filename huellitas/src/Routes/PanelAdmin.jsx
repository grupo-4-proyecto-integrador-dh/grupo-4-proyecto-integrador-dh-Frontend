import React, { useState, useEffect } from "react";
import Sidebar from "../Components/PanelAdmin/SideBar";
import "../Styles/Administracion.css";
import Alojamientos from "../Components/PanelAdmin/Alojamientos/SectionAlojamientos";
import Usuarios from "../Components/PanelAdmin/Usuarios/UserSection";



const PanelAdmin = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);




  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);


const [seccion, setSeccion] = useState("alojamientos");

    const handleSectionChange = (seccion) => {
        setSeccion(seccion);
    };

    const renderSeccion = () => {
        switch (seccion) {
            case "alojamientos":
                return <Alojamientos />;
            case "reservas":
                return <Reservas />;
            case "usuarios":
                return <Usuarios />;
            case "configuracion":
                return <Configuracion />;
            default:
                return <Alojamientos />;
        }
    };

    if (isMobile) {
      return <div className="mobile-warning">El panel de administración no está disponible en dispositivos móviles.</div>;
    }
return (
  <div className="admin-container">
      <Sidebar onSectionChange={handleSectionChange} />
      <div className="main-content">
          {renderSeccion()}
      </div>
  </div>
);
};

export default PanelAdmin;
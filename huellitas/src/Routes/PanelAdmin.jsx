import React, { useState, useEffect } from "react";
import "../Styles/administracion.css";
import { useNavigate } from "react-router-dom";
import Cloudinary from "../Components/PanelAdmin/Cloudinary";

function PanelAdmin() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [servicios, setServicios] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // <1024px se considera móvil
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cargar servicios guardados en localStorage
  useEffect(() => {
    const serviciosGuardados = JSON.parse(localStorage.getItem("servicios")) || [];
    setServicios(serviciosGuardados);
  }, []);

  const agregarServicio = () => {
    if (!nombre.trim() || !descripcion.trim() || !precio.trim() || !imagen) {
      setMensaje({ texto: "⚠️ Todos los campos son obligatorios.", tipo: "error" });
      return;
    }

    const existe = servicios.some(
      (servicio) => servicio.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
      setMensaje({ texto: "⚠️ ¡Este servicio ya está registrado! Verifica.", tipo: "error" });
      return;
    }

    // Asegurar que el precio sea un número válido
    const precioNumerico = parseFloat(precio);
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      setMensaje({ texto: "⚠️ El precio debe ser un número válido.", tipo: "error" });
      return;
    }

    const nuevoServicio = { nombre, descripcion, precio: precioNumerico, imagen };
    const nuevosServicios = [...servicios, nuevoServicio];

    setServicios(nuevosServicios);
    localStorage.setItem("servicios", JSON.stringify(nuevosServicios));

    setMensaje({ texto: "✅ ¡Servicio agregado con éxito!", tipo: "exito" });

    // Limpiar campos después de guardar
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagen(null);

    // Eliminar mensaje después de 3 segundos
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Bloquear el acceso si es un dispositivo móvil
  if (isMobile) {
    return <h2 className="mensaje-bloqueo">❌ El panel de administración no está disponible en dispositivos móviles.</h2>;
  }

  return (
    <div className="container">
      <h1>🛒 Gestión de servicios </h1>

      <input
        type="text"
        className="input-field"
        placeholder="Nombre del servicio"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        className="input-field"
        placeholder="Descripción del servicio"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <input
        type="number"
        className="input-field"
        placeholder="Precio del servicio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />

      <input
        type="file"
        className="input-field"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {imagen && <img src={imagen} alt="Vista previa" className="preview-img" />}

      <div className="button-container">
        <button className="button" onClick={agregarServicio}>Agregar Servicio</button>
        <button className="buttonList" onClick={()=> navigate("/lista")}>Lista de Servicios</button>
      </div>

      {mensaje.texto && <p className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</p>}
      <Cloudinary />
    </div>
    
  );
}

export default PanelAdmin;

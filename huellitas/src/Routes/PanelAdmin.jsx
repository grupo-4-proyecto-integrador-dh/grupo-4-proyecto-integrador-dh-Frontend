const PanelAdmin = () => {
  return <div>PanelAdmin</div>;
};

import React, { useState, useEffect } from "react";
import "./administracion.css";

function App() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [servicios, setServicios] = useState([]);

  // Cargar servicios desde localStorage al iniciar
  useEffect(() => {
    const serviciosGuardados = JSON.parse(localStorage.getItem("servicios")) || [];
    setServicios(serviciosGuardados);
  }, []);

  const agregarServicio = () => {
    if (!nombre.trim() || !descripcion.trim() || !precio.trim() || !imagen) {
      setMensaje({ texto: "⚠️ Todos los campos son obligatorios.", tipo: "error" });
      return;
    }

    // Verificar si el servicio ya existe
    const existe = servicios.some(
      (servicio) => servicio.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
      setMensaje({ texto: "⚠️ ¡Este servicio ya está registrado! Verifica.", tipo: "error" });
      return;
    }

    // Agregar nuevo servicio
    const nuevoServicio = { nombre, descripcion, precio, imagen };
    const nuevosServicios = [...servicios, nuevoServicio];

    setServicios(nuevosServicios);
    localStorage.setItem("servicios", JSON.stringify(nuevosServicios)); // Guardar en localStorage

    setMensaje({ texto: "✅ ¡Servicio guardado con éxito!", tipo: "exito" });

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

  return (
    <div className="container">
      <h1>🔧 Gestión de Servicios</h1>

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

      <button className="button" onClick={agregarServicio}>Guardar Servicio</button>

      {mensaje.texto && <p className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</p>}
    </div>
  );
}

export default App;
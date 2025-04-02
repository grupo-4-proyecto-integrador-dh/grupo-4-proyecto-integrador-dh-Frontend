import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../Styles/RegistroMascota.scss";

const RegistroMascota = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [peso, setPeso] = useState("");
  const [edad, setEdad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const url_base = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      Swal.fire({
        title: "Acceso denegado",
        text: "Debes iniciar sesión para registrar una mascota",
        icon: "warning",
        confirmButtonText: "Iniciar sesión"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setToken(storedToken);
      setUserId(userData.id);
    } catch (error) {
      console.error("Error al procesar los datos de usuario:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al cargar la información del usuario",
        icon: "error"
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El nombre de la mascota es obligatorio",
        icon: "warning"
      });
      return;
    }
    
    try {
      setCargando(true);
      
      const mascotaData = {
        nombre,
        clienteId: userId,
        especie: especie || null,
        raza: raza || null,
        peso: peso ? parseFloat(peso) : null,
        edad: edad ? parseInt(edad) : null,
        observaciones: observaciones || null,
        activo: true
      };
      
      await axios.post(
        `${url_base}/api/mascotas`,
        mascotaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      Swal.fire({
        title: "¡Mascota registrada!",
        text: "La mascota ha sido registrada exitosamente",
        icon: "success",
        confirmButtonText: "Volver al perfil"
      }).then(() => {
        navigate("/perfil");
      });
      
    } catch (error) {
      console.error("Error al registrar mascota:", error);
      
      try {
        const mascotaDataAlt = {
          nombre,
          clienteId: userId.toString(),
          especie: especie || null,
          raza: raza || null,
          peso: peso ? parseFloat(peso) : null,
          edad: edad ? parseInt(edad) : null,
          observaciones: observaciones || null,
          activo: true
        };
        
        await axios.post(
          `${url_base}/api/mascotas`,
          mascotaDataAlt,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        Swal.fire({
          title: "¡Mascota registrada!",
          text: "La mascota ha sido registrada exitosamente",
          icon: "success",
          confirmButtonText: "Volver al perfil"
        }).then(() => {
          navigate("/perfil");
        });
        
      } catch (altError) {
        console.error("Error alternativo al registrar mascota:", altError);
        Swal.fire({
          title: "Error",
          text: "No se pudo registrar la mascota. Por favor intenta nuevamente.",
          icon: "error"
        });
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-mascota-container">
      <div className="registro-mascota-header">
        <h1>Registrar Nueva Mascota</h1>
        <p>Por favor completa el formulario con los datos de tu mascota</p>
      </div>
      
      <div className="registro-mascota-form-container">
        <form onSubmit={handleSubmit} className="registro-mascota-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la mascota *</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Luna"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="especie">Especie</label>
            <select
              id="especie"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            >
              <option value="">Seleccionar especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Roedor">Roedor</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="raza">Raza</label>
            <input
              type="text"
              id="raza"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
              placeholder="Ej: Labrador, Siamés, etc."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="peso">Peso (kg)</label>
              <input
                type="number"
                id="peso"
                step="0.1"
                min="0"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ej: 5.5"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edad">Edad (años)</label>
              <input
                type="number"
                id="edad"
                min="0"
                max="30"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Ej: 3"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Alergias, comportamiento, necesidades especiales, etc."
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/perfil")}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={cargando}
            >
              {cargando ? "Registrando..." : "Registrar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroMascota; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Registro.scss";

const API_URL = "https://grupo-4-proyecto-integrador-dh-b-production.up.railway.app/api/auth/registro";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
  });

  const [errors, setErrors] = useState({});
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido) newErrors.apellido = "El apellido es requerido";
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    if (!formData.contrasena || formData.contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje("");  // Limpiar el mensaje de error previo
    if (validate()) {
      try {
        console.log("Datos enviados al backend:", JSON.stringify(formData)); // Log de los datos enviados
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const textResponse = await response.text(); // Obtener la respuesta como texto primero
        console.log("Respuesta del backend:", textResponse);

        if (!response.ok) {
          throw new Error(textResponse);  // En lugar de intentar parsear como JSON, tira el texto directamente
        }
        
        try {
          const data = JSON.parse(textResponse);  // Intenta parsear a JSON manualmente si es posible
          console.log("Datos JSON:", data);
        } catch (error) {
          console.error("No se pudo parsear como JSON:", error);
        }

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error del servidor:", errorData); // Log de los detalles del error
          throw new Error(errorData.message || "Error en el registro.");
        }
  
        setRegistroExitoso(true);
        setTimeout(() => {
          setRegistroExitoso(false);
          navigate("/login"); // Redirige al login después del registro exitoso
        }, 3000);
      } catch (error) {
        console.error("Error en el registro:", error);
        setErrorMensaje(error.message);
      }
    }
  };
  

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2 className="registro-title">Registro</h2>

        {/* Mensaje de error general */}
        {errorMensaje && <p className="error-text">{errorMensaje}</p>}

        <form onSubmit={handleSubmit} className="registro-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? "input-error" : "input"}
          />
          {errors.nombre && <p className="error-text">{errors.nombre}</p>}

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={errors.apellido ? "input-error" : "input"}
          />
          {errors.apellido && <p className="error-text">{errors.apellido}</p>}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : "input"}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            className={errors.contrasena ? "input-error" : "input"}
          />
          {errors.contrasena && <p className="error-text">{errors.contrasena}</p>}

          <button type="submit" className="registro-button">Registrarse</button>

          {/* Mensaje de éxito */}
          {registroExitoso && (
            <p className="success-message">✅ Registro exitoso. Redirigiendo...</p>
          )}
        </form>
      </div>
    </div>
  );
}


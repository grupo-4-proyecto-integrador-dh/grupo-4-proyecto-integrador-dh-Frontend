import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Registro.scss";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [registroExitoso, setRegistroExitoso] = useState(false);
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
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      
      const emailExists = storedUsers.some((user) => user.email === formData.email);
      if (emailExists) {
        setErrors({ email: "Este correo ya está registrado." });
        return;
      }

      
      const newUser = { ...formData };
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      setRegistroExitoso(true);
      setTimeout(() => {
        setRegistroExitoso(false);
        navigate("/login"); 
      }, 2000);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2 className="registro-title">Registro</h2>
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
            placeholder="Ingresa tu Correo"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : "input"}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Ingresa tu Contraseña"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : "input"}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" className="registro-button">Registrarse</button>

          {registroExitoso && (
            <p className="success-message">✅ Registro exitoso. Redirigiendo...</p>
          )}
        </form>
      </div>
    </div>
  );
}

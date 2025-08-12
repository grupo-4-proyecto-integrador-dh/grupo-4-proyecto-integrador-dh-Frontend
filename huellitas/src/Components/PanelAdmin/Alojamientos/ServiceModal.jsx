import React, { useEffect, useState } from "react";
import axios from "axios";

const ServiceModal = ({
  modalAbierto,
  toggleModal,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  precio,
  setPrecio,
  categoria,
  setCategoria,
  imagenes,
  uploadImage,
  loading,
  eliminarImagen,
  agregarServicio,
  servicioEditando,
}) => {
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/categorias`
        );
        console.log("Categorías cargadas:", response.data);
        setCategorias(response.data);
        setLoadingCategorias(false);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  if (!modalAbierto) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={toggleModal}>
          &times;
        </span>
        <h3>{servicioEditando ? "Editar Alojamiento" : "Agregar Alojamiento"}</h3>
        <form onSubmit={agregarServicio}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
            required
          />
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio"
            required
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <label className="custom-file-upload">
            <input
              type="file"
              onChange={uploadImage}
              multiple
              accept="image/*"
              className="file-input"
            />
            <div className="file-label">
              <span>📸 Seleccionar imágenes</span>
            </div>
          </label>
          {loading && <p>Subiendo imágenes...</p>}
          <div className="image-preview">
            {imagenes.map((img, index) => (
              <div key={index} className="image-container">
                <img
                  src={img}
                  alt={`Preview ${index}`}
                  className="preview-img"
                />
                <button
                  type="button"
                  className="delete-img-btn"
                  onClick={() => eliminarImagen(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="submit" className="btn-agregar">
            {servicioEditando ? "Guardar Cambios" : "Agregar Alojamiento"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;

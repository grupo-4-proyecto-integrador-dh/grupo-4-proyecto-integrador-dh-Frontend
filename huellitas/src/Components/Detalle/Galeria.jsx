import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import Foto from "./Foto";
import "../../Styles/Galeria.css";
import GaleriaModal from "./GaleriaModal";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/alojamientos";

function Galeria() {
  const { id } = useParams();
  const [imagenes, setImagenes] = useState([]); // Inicializar como array vacío
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener las imágenes");

        const data = await response.json();
        console.log("Respuesta API:", data); // 👀 Verificar en consola

        if (Array.isArray(data.imagenesUrl)) {
          setImagenes(data.imagenesUrl); // Guardar directamente el array de URLs
        } else {
          console.error("La API no devolvió imágenes válidas:", data);
        }
      } catch (error) {
        console.error("Error al obtener las imágenes:", error);
      }
    };

    if (id) {
      fetchImagenes();
    }
  }, [id]);

  return (
    <div className="grid_layout_galeria">
      {imagenes.length > 0 ? (
        <>
          {imagenes.slice(0, 5).map((url, index) => (
            <Foto
              key={index}
              tipoFoto={index === 0 ? "imagen_principal" : "imagen_secundaria"}
              imagen={url}
              alt={`Imagen ${index + 1}`}
            />
          ))}
          {!show && (
            <Button className="boton_vermas_galeria" variant="primary" onClick={() => setShow(true)}>
              Ver más
            </Button>
          )}
          {show && <GaleriaModal show={show} setShow={setShow} foto={imagenes} dialogClassName="custom-modal" />}
        </>
      ) : (
        <p>Cargando imágenes o no hay imágenes disponibles.</p>
      )}
    </div>
  );
}

export default Galeria;




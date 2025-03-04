import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit, FaHome, FaClipboardList, FaMoneyBillWave, FaCog } from "react-icons/fa";
import "../Styles/Administracion.css";
import axios from "axios"; 

const api = axios.create({
  baseURL: "http://localhost:8081/alojamientos", 
});

const PanelAdmin = () => {
  //Cloudinary
  const preset_name = "huellitas";                         
  const cloud_name = "dr8ya7bax"; 

  // Estados
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [ image, setImage ] = useState([]);
  const [ loading, setLoading ] = useState(false)
  const fileInputRef = useRef(null);

  // Manejo de cambio de tamaño de pantalla para que no se pueda ver en celulares
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carga de servicios desde el backend 
  useEffect(() => {
    api.get("/")
      .then(response => {
        setServicios(response.data);
      })
      .catch(error => {
        console.error("Error al cargar los servicios:", error);
      });
  }, []);

  //upload image
  const uploadImage = async (e) => {
    const files = e.target.files;  // Recuperamos el array de archivos
    const newImageUrls = [];  // Array para almacenar las URLs de las imágenes subidas

    setLoading(true);  // Indicamos que la imagen se está cargando

    try {
        // Subir cada imagen de forma individual
        for (let i = 0; i < files.length; i++) {
            const data = new FormData();  // Creamos un nuevo FormData para cada archivo
            data.append('file', files[i]);  // Agregamos el archivo al FormData
            data.append('upload_preset', preset_name);  // Agregamos el preset de Cloudinary

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();  // Parseamos la respuesta JSON

            if (result.secure_url) {
                newImageUrls.push(result.secure_url);  // Agregamos la URL de la imagen al array
            }
        }

        // Actualizamos el estado con las nuevas imágenes
        setImagenes((prevImagenes) => [...prevImagenes, ...newImageUrls]);
        setArchivos((prev) => [...prev, ...files]);

    } catch (error) {
        console.error('Error uploading images:', error);
    } finally {
        setLoading(false);  // Terminamos el proceso de carga
    }
}

  // Alternar modal
  const toggleModal = () => {
    if (modalAbierto) {
      // Reiniciar los estados al cerrar el modal
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagenes([]);
      setServicioEditando(null);
    }
    setModalAbierto(!modalAbierto);
  };

  // Agregar o editar servicio
  const agregarServicio = () => {
    if (!nombre || !descripcion || !precio || imagenes.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios, incluida al menos una imagen", 
        icon: "error", 
          customClass: {
            confirmButton: "mi-boton-ok",
        },
    });
      return;
    }

    const nuevoServicio = { nombre, descripcion, precio, imagenes };

    if (servicioEditando) {
      api.put(`/${servicioEditando}`, nuevoServicio)
        .then(response => {
          setServicios(prev => prev.map(servicio => servicio.id === servicioEditando ? response.data : servicio));
          Swal.fire({
            title: "Éxito",
            text: "Servicio editado correctamente",
            icon: "success",
            customClass: {
              confirmButton: "mi-boton-ok",
            },
          });
        })
        .catch(error => {
          console.error("Error al editar el servicio:", error);
          // Verifica si el error tiene una respuesta del servidor
          if (error.response && error.response.status === 409) { 
            Swal.fire({
              title: "Error",
              text: "El nombre del servicio ya está en uso. Por favor, elige otro.", 
              icon: "error",
              customClass: {
                confirmButton: "mi-boton-ok",
              }
            });
            return;
          }
          // Si el error es otro, mostrar un mensaje genérico
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al editar el servicio. Inténtalo nuevamente.", 
            icon: "error",
            customClass: {
              confirmButton: "mi-boton-ok",
            }
          });
        });
      } else {
        api.post("/", nuevoServicio)
          .then(response => {
            setServicios(prev => [...prev, response.data]);
            Swal.fire({
              title: "Éxito",
              text: "Servicio agregado correctamente",
              icon: "success",
              customClass: {
                confirmButton: "mi-boton-ok",
              },
            });
          })
          .catch(error => {
            console.error("Error al agregar el servicio:", error);
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al agregar el servicio. Inténtalo nuevamente.", 
              icon: "error",
              customClass: {
                confirmButton: "mi-boton-ok",
              }
            });
          });
      }
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagenes([]);
      setServicioEditando(null);
      setModalAbierto(false);
  };

  // Eliminar servicio
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'mi-popup',        
        title: 'mi-titulo',       
        content: 'mi-contenido',  
        confirmButton: 'mi-boton-confirmar',  
        cancelButton: 'mi-boton-cancelar'    
      }
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/${id}`)
          .then(() => {
            setServicios(prev => prev.filter(servicio => servicio.id !== id));
            Swal.fire({
              title: "Eliminado",
              text: "El servicio ha sido eliminado",
              icon: "success",
              customClass: {
                popup: 'mi-popup-exito',
                confirmButton: 'mi-boton-ok'
              }
            });
          })
          .catch(error => {
            console.error("Error al eliminar el servicio:", error);
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al eliminar el servicio. Inténtalo nuevamente.", 
              icon: "error",
              customClass: {
                confirmButton: "mi-boton-ok",
              }
            });
          });
        }
      });
  };

  // Editar servicio
  const handleEdit = (servicio) => {
    Swal.fire({
      title: "¿Quieres editar este servicio?",
      text: `Estás editando: ${servicio.nombre}`,
      icon: "info",
      iconColor: "#f4e3c1",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "mi-popup",
        title: "mi-titulo",
        content: "mi-contenido",
        confirmButton: "mi-boton-confirmar",
        cancelButton: "mi-boton-cancelar",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setNombre(servicio.nombre);
        setDescripcion(servicio.descripcion);
        setPrecio(servicio.precio);
        setImagenes([...servicio.imagenes]);
        setServicioEditando(servicio.id);
        setModalAbierto(true); 
      }
    });
  };
  
  // Eliminar imagen
const eliminarImagen = (index) => {
  // Filtramos para quitar la imagen en la posición 'index'
  const nuevasImagenes = imagenes.filter((_, i) => i !== index);

  // Actualizamos el estado
  setImagenes(nuevasImagenes);

  // Si hay un input de archivos, actualizamos su contenido
  if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      
      // Recorremos las imágenes restantes y las añadimos de nuevo
      for (let i = 0; i < fileInputRef.current.files.length; i++) {
          if (i !== index) {
              dataTransfer.items.add(fileInputRef.current.files[i]);
          }
      }

      fileInputRef.current.files = dataTransfer.files; // Asignamos el nuevo FileList
  }
};


  // Verificación de pantalla no se puede ver en móvil
  if (isMobile) {
    return <div className="mobile-warning">
        🚫 El panel de administración no está disponible en dispositivos móviles.</div>;
  }

  return (
    <div className="admin-container">
      {/* Menú de Navegación */}
      <div className="sidebar">
        <h2>Panel de Administración</h2>
        <ul>
          <li><FaHome /> Gestión de Alojamientos</li>
          <li><FaClipboardList /> Gestión de Reservas</li>
          <li><FaMoneyBillWave /> Gestión de Pagos</li>
          <li className="config-admin"><FaCog /> Configuración del Sitio</li>
        </ul>
      </div>
      
      {/* Contenido Principal */}
      <div className="main-content">
        <div className="top-bar">
          <input
            type="text"
            className="input-busqueda"
            placeholder=" Buscar servicios... "
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn-agregar" onClick={toggleModal}>
            <FaPlus /> Agregar Servicio
          </button>
        </div>

       {/* 🔹 Tabla de Servicios */}
       <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imágenes</th>
              <th>Acciones</th> {/* Nueva columna para editar/eliminar */}
            </tr>
          </thead>
          <tbody>
            {servicios.filter(servicio => servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.nombre}</td>
                <td>{servicio.descripcion}</td>
                <td>${servicio.precio}</td>
                <td>
                  {servicio.imagenes.length > 0 ? servicio.imagenes.map((img, index) => (
                    <img key={index} src={img} alt="Servicio" className="preview-img-table" />
                  )) : "No hay imágenes"}
                </td>
                <td>
                  <FaEdit className="edit-icon" onClick={() => handleEdit(servicio)} />
                  <FaTrash className="delete-icon" onClick={() => handleDelete(servicio.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>  
  
    {/* Modal para agregar servicio */}
    {modalAbierto && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h3>Agregar Servicio</h3>
            <input 
              type="text" 
              placeholder="Nombre" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Descripción" 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="Precio" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)} 
            />
            {/* Input para seleccionar varias imágenes */}
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              ref={fileInputRef}
              onChange={(e)=>uploadImage(e)} 
            />         
            {/* Vista previa de imágenes */}
            {loading ? (
              <h3>Loading...</h3>
            ) : (
              <div className="image-preview">
                {imagenes.map((img, index) => (
                  <div key={index} className="image-container">
                    <img src={img} alt={`Uploaded image ${index}`} className="preview-img" />
                    <button className="delete-img-btn" onClick={() => eliminarImagen(index)}>x</button>
                  </div>
                ))}
              </div>
            )}
            {/* Botón para guardar el servicio */}
            <button className="btn-agregar" onClick={agregarServicio}>Guardar Servicio</button>
          </div>
        </div>               
    )}
      </div>
  );
};

export default PanelAdmin;
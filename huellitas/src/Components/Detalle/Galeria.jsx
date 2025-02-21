import { useState, useEffect } from 'react'
import Foto from './Foto';
import '../../Styles/Galeria.css'

function Galeria() {
  const [isOpen, setIsOpen] = useState(false);
  const [foto, setImages] = useState([]);

  useEffect(() => {
    fetch("/imagenes.json") 
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error("Error cargando imágenes:", error));
  }, []);

  return (
    <div className='contenedor_galeria'>
      <div className='grid_layout_galeria'>
        {foto.slice(0, 5).map((foto,index)=> (
          <Foto
            key={foto.id}
            imagen={foto.imagen} 
            tipoFoto={index === 0 ? "imagen_principal" : "imagen_secundaria"}
          />
        ))} 
        {!isOpen && ( <button className="boton_vermas_galeria" onClick={() => setIsOpen(true)}> Ver mas </button>)}   
      </div>
      {isOpen && <Modal onClose={() => setIsOpen(false)} foto={foto}/>} 
    </div>  
  );
}

function Modal({ onClose, foto }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true); 
    setTimeout(() => {
      onClose(); 
      setClosing(false); 
    }, 1000);
  };

  return (
    <div className={`ventana_modal_galeria ${closing ? "fadeOut" : "fadeIn"}`}>
      <div className="grid_layout_modal">
        {foto.map((foto, index) => (
          <Foto key={foto.id || index} imagen={foto.imagen} tipoFoto="imagen_Modal"/>
        ))}
        <button className="boton_cerrar_modal" onClick={handleClose}>
          X
        </button>
      </div>
    </div>
  );
}
export default Galeria

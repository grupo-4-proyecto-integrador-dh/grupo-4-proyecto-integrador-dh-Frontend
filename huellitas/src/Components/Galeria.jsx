import { useState, useEffect } from 'react'
import Foto from './Foto';
import '../Styles/Galeria.css'

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
   <div>
    <div className='galeria'>
      <div className='grid-layout'>
        {foto.slice(0, 5).map((foto,index)=> (
          <Foto
            key={foto.id}
            imagen={foto.imagen} 
            className={index === 0 ? "imagen_principal" : "imagen_secundaria"}
          />
        ))} 
        {!isOpen && ( <button className="boton_vermas" onClick={() => setIsOpen(true)}> Ver mas </button>)}
        {isOpen && <Modal onClose={() => setIsOpen(false)} foto={foto}/>}    
      </div>
    </div>
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
    <div className={`ventana_modal ${closing ? "fadeOut" : "fadeIn"}`}>
      <div className="grid-layout">
        {foto.map((foto, index) => (
          <Foto key={foto.id || index} imagen={foto.imagen} />
        ))}
        <button className="boton_cerrar" onClick={handleClose}>
          X
        </button>
      </div>
    </div>
  );
}
export default Galeria

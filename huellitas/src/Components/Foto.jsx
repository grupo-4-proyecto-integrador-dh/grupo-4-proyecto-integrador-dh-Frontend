import React from 'react';

const Foto = ({ imagen, className }) => {
  return (
    <div className={className}>            
        <img className="foto" src={imagen} alt="Imagen" />
    </div>
  );
};

export default Foto;
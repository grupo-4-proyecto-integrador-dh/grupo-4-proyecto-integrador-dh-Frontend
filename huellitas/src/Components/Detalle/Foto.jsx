import React from 'react';

const Foto = ({ imagen, tipoFoto}) => {
  return (
    <div className={tipoFoto}>    
        <img className="foto" src={imagen} alt="Imagen" />
    </div>
  );
};

export default Foto;
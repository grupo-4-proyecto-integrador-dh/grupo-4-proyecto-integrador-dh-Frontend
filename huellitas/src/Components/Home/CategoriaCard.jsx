const CategoriaCard = ({ nombre, imagen, alt }) => {
  return (
    <a className="categorias__card">
      <p>{nombre}</p>
      <img loading="lazy" src={imagen} alt={alt} />
    </a>
  );
};

export default CategoriaCard;

import PropTypes from "prop-types"
const CategoriaCard = ({ nombre, imagen, alt, cantidad, onClick }) => {
  return (
    <div className="card__container" onClick={onClick}>
      <div className="categorias__card">
        <img loading="lazy" src={imagen} alt={alt} />
      </div>
      <div className="categorias__card__info">
        <p>{nombre}</p>
        <span className="cantidad">({cantidad})</span>
      </div>
    </div>
  );
};

CategoriaCard.propTypes = {
  nombre: PropTypes.string.isRequired,
  imagen: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  cantidad: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

CategoriaCard.defaultProps = {
  onClick: () => {},
};

export default CategoriaCard;

import PropTypes from "prop-types";

const CategoriaCard = ({ nombre, imagen, alt, cantidad, onClick, isSelected }) => {
  return (
    <div className={`card__container ${isSelected ? "selected" : ""}`} onClick={onClick}>
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
  isSelected: PropTypes.bool,
};

CategoriaCard.defaultProps = {
  onClick: () => {},
  isSelected: false,
};

export default CategoriaCard;

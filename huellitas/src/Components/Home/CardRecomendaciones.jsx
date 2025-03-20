import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CardRecomendaciones = ({ id, title, description, imagenes, price, alojamiento }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/alojamiento/${id}`, { state: alojamiento });
    window.location.reload();
  };

  return (
    <div className="card__recomendaciones">
      {imagenes ? (
        <img
          loading="lazy"
          src={imagenes.length > 0 ? imagenes[0].urlImagen : "/ruta/imagen-por-defecto.jpg"}
          alt={title}
          className="card__image"
        />
      ) : (
        <img
          loading="lazy"
          src="/placeholder.jpg"
          alt="Placeholder"
          className="card__image card__image--placeholder"
        />
      )}
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
        <div className="card__price-details">
          <span className="card__price">${price}</span>
          <button className="card__details-button" onClick={handleCardClick}>
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

CardRecomendaciones.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imagenes: PropTypes.array,
  alojamiento: PropTypes.object,
};

export default CardRecomendaciones;
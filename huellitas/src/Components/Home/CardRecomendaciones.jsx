import PropTypes from "prop-types";
import { Link } from "react-router-dom";


const CardRecomendaciones = ({ id, title, description, price ,imageUrl }) => {
  return (
    <div>
      <Link to={"/alojamiento/" + id} className="card__recomendaciones">
      {imageUrl ? (
        <img loading="lazy" src={imageUrl} alt={title} className="card__image" />
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
        <h4 className="card__description">{description}</h4>
        <p className="card__description">{price}</p>
      </div>
      </Link>
    </div>
  );
};

CardRecomendaciones.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

export default CardRecomendaciones;

import PropTypes from "prop-types";


const CardRecomendaciones = ({ title, description, imageUrl }) => {
  return (
    <div className="card">
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
        <p className="card__description">{description}</p>
      </div>
    </div>
  );
};

CardRecomendaciones.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

export default CardRecomendaciones;

import PropTypes from 'prop-types';
import '../Styles/CardP.css';

const CardP = ({ title, description, imageUrl }) => {
  return (
    <div className="cardP">
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

CardP.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

export default CardP;
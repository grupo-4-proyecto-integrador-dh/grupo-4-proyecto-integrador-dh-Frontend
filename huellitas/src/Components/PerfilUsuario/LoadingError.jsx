import PropTypes from 'prop-types';

// Componente para manejar los estados de carga y error
const LoadingError = ({ isLoading, error, children }) => {
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return children;
};

// Definir PropTypes para el componente
LoadingError.propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  children: PropTypes.node
};

// Valores por defecto
LoadingError.defaultProps = {
  isLoading: false,
  error: null
};

export default LoadingError; 
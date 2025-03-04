
//import React from 'react';
import { Link } from 'react-router-dom';
import "../Styles/NotFoundPage.css"


const NotFoundPage = () => {
    return (
        <div className="not-found-container">
          <img src="/Error-404-dog.png" alt="Error 404" className="error-image" />
          <p className="error-text">Oops! Parece que esta página no existe.</p>
          <Link to="/" className="back-home">Volver al inicio</Link>
        </div>
      );
};


export default NotFoundPage;



 



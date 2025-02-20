import "../Styles/Header.css";
import { Link } from "react-router-dom";
import logo from "/public/media/svg/logo-svg.svg";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary">
      <div className="container-fluid p-4">
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Huellitas Logo"
            width="160"
            height="40"
            className="d-inline-block align-text-top"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active fst-italic text-body-tertiary"
                aria-current="page"
                to="/"
              >
                Un hogar para tu mascota
              </Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <button className="btn btn-outline-success me-2" type="button">
              Crear Cuenta
            </button>
            <button className="btn btn-outline-success" type="button">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;

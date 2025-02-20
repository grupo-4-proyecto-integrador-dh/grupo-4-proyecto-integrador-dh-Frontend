import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../Styles/Footer.css";
import logo from "/media/svg/logo-svg.svg";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={logo} alt="Huellitas Logo" className="footer-logo" />
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Huellitas. Todos los derechos
            reservados.
          </p>
        </div>
        <div className="footer-menu">
          <h4>Menú</h4>
          <ul>
            <li>
              <Link to="/Productos">Productos</Link>
            </li>
            <li>
              <Link to="/link2">Link 2</Link>
            </li>
            <li>
              <Link to="/link3">Link 3</Link>
            </li>
            <li>
              <Link to="/link4">Link 4</Link>
            </li>
          </ul>
        </div>
        <div className="footer-menu">
          <h4>Categorías</h4>
          <ul>
            <li>
              <Link to="/category1">Category 1</Link>
            </li>
            <li>
              <Link to="/category2">Category 2</Link>
            </li>
            <li>
              <Link to="/category3">Category 3</Link>
            </li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Redes Sociales</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

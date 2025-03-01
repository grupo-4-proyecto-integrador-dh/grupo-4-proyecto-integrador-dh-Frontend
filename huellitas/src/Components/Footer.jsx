import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../Styles/Footer.css";
import logo from "/media/svg/logo-svg.svg";

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

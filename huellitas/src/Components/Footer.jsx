import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../Styles/Footer.css';
import logo from "../logo-example_1 1 (1).ico";

function Footer() {
  return (
    <footer className="footer footer-bg  py-4 w-100">
      <Container>
        <Row>
          <Col lg={4}>
            <img src={logo} alt="Huellitas Logo" className="footer-logo py-2" />
            <p className="mb-0">&copy; {new Date().getFullYear()} Huellitas. Todos los derechos reservados.</p>
          </Col>
          <Col>
            <h4>Menu</h4>
            <Nav className="flex-column">
              <Nav.Link href="#" className="text-dark">Link</Nav.Link>
              <Nav.Link href="#" className="text-dark">Link</Nav.Link>
              <Nav.Link href="#" className="text-dark">Link</Nav.Link>
              <Nav.Link href="#" className="text-dark">Link</Nav.Link>
            </Nav>
          </Col>
          <Col>
            <h4>Categories</h4>
            <Nav className="flex-column">
              <Nav.Link href="#" className="text-dark">Link</Nav.Link>
              <Nav.Link href="#" className="text-dark">Link</Nav.Link>
              <Nav.Link href="#" className="text-dark">Link</Nav.Link>
            </Nav>
          </Col>
          <Col lg={3}>
            <h4>Social Media</h4>
            <a href="#" aria-label="Facebook" className="text-dark fs-2 me-3">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="text-dark fs-2 me-3">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-dark fs-2 me-3">
              <FaLinkedin />
            </a>
          </Col>
        </Row>
        
      </Container>
    </footer>
  );
}

export default Footer;

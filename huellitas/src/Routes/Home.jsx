import productos from "../productos"; // Asegúrate de que los productos están en un array
import "../Styles/Home.css";
import logo from "../logo-example_1 1 (1).ico";
import { Link } from "react-router-dom";

const Home = () => {
  // Mezcla los productos de forma aleatoria y toma los primeros 10
  const productosAleatorios = [...productos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <div className="home-container">
      <section className="busqueda">
        <h2>Busqueda</h2>
      </section>
      <section className="categorias">
        <h2>Categorias de alojamiento</h2>
        <div className="flex-container">
          <Link to="/detalle" className="card">
            <img src={logo} alt="Premium" />
            <h3>Premium</h3>
          </Link>
          <Link to="/detalle" className="card">
            <img src={logo} alt="Semi-Premium" />
            <h3>Semi-Premium</h3>
          </Link>
          <Link to="/detalle" className="card">
            <img src={logo} alt="Básico" />
            <h3>Básico</h3>
          </Link>
          <Link to="/detalle" className="card">
            <img src={logo} alt="Otra" />
            <h3>Otro</h3>
          </Link>
        </div>
      </section>
      <section className="recomendados">
        <h2>Recomendaciones</h2>
        <div className="grid-container">
          {productosAleatorios.map((producto) => (
            <div className="card" key={producto.id}>
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

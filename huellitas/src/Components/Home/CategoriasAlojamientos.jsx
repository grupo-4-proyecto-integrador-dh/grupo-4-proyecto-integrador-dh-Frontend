import CategoriaCard from "./CategoriaCard";

const CategoriasAlojamientos = () => {
  return (
    <section className="main__categorias">
      <h1 hidden>Categorías:</h1>
      <span>
        <CategoriaCard
          nombre={"Habitaciones Individuales"}
          imagen={"/imagenes/perro-puff.jpg"}
          alt={"Perros felices"}
        />
        <CategoriaCard
          nombre={"Jaulas"}
          imagen={"/imagenes/ave-jaula.jpg"}
          alt={"Perros felices"}
        />
        <CategoriaCard
          nombre={"Espacios abiertos"}
          imagen={"/imagenes/perros-jugando.jpg"}
          alt={"Perros felices"}
        />
      </span>
    </section>
  );
};

export default CategoriasAlojamientos;

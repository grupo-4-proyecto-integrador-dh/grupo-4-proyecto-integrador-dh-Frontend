import alojamientos from "../../alojamientos";

const RecomendacionesAlojamientos = () => {
  const alojamientosAleatorios = [...alojamientos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <section className="main__recomendaciones">
      {alojamientosAleatorios.map((alojamiento) => (
        <div className="card" key={alojamiento.id}>
          <img
            loading="lazy"
            src={alojamiento.imagen}
            alt={alojamiento.nombre}
          />
          <h3>{alojamiento.nombre}</h3>
          <p>{alojamiento.descripcion}</p>
        </div>
      ))}
    </section>
  );
};

export default RecomendacionesAlojamientos;

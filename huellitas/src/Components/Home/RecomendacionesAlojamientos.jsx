import alojamientos from "../../alojamientos";

const RecomendacionesAlojamientos = () => {
  const alojamientosAleatorios = [...alojamientos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <section className="main__recomendaciones">
      <h1>Recomendaciones:</h1>
      <div className="main__recomendaciones__grid">
        {alojamientosAleatorios.map((alojamiento) => (
          <div className="card" key={alojamiento.id}>
            <img
              loading="lazy"
              src={alojamiento.imagen}
              alt={alojamiento.nombre}
            />
            <div className="card-content">
              <h3>{alojamiento.nombre}</h3>
              <p>{alojamiento.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecomendacionesAlojamientos;

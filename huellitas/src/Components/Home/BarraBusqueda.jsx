const BarraBusqueda = () => {
  return (
    <div>
      <input
        className="form-control-sm "
        type="text"
        name="buscar"
        id="buscar"
        placeholder="Buscar..."
      />
      <input
        className="form-control-sm "
        type="date"
        name="fecha-buscar"
        id="fecha-buscar"
      />
      <button>Buscar</button>
    </div>
  );
};

export default BarraBusqueda;

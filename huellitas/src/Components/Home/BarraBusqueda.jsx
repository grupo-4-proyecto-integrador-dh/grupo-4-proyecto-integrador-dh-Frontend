const BarraBusqueda = () => {
  return (
    <div className="main__buscar__fields">
      <input
        className="main__buscar__fields__texto form-control-sm "
        type="text"
        name="buscar"
        id="buscar"
        placeholder="Buscar..."
      />
      <input
        className="main__buscar__fields__fecha form-control-sm "
        type="date"
        name="fecha-buscar"
        id="fecha-buscar"
      />
      <button className="main__buscar__fields__submit">Buscar</button>
    </div>
  );
};

export default BarraBusqueda;

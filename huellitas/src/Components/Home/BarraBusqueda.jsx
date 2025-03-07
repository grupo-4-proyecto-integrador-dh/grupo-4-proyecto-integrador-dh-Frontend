import { useState } from "react";

const BarraBusqueda = (props) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="main__buscar__fields">
      <input
        className="main__buscar__fields__texto form-control-sm "
        type="text"
        name="buscar"
        id="buscar"
        value={searchInput}
        placeholder="Buscar..."
        onInput={(e) => {
          e.preventDefault();
          setSearchInput(e.target.value);
        }}
      />
      <input
        className="main__buscar__fields__fecha form-control-sm "
        type="date"
        name="fecha-buscar"
        id="fecha-buscar"
      />
      <button
        className="main__buscar__fields__submit"
        onClick={(e) => {
          e.preventDefault();
          props.setSearchQuery(searchInput);
        }}
      >
        Buscar
      </button>
    </div>
  );
};

export default BarraBusqueda;

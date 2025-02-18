import { Context } from "../Context/Context";
import TablaProductos from "../Components/TablaProductos";

const ListaProductos = () => {
  return (
    <Context>
      <div className="container">
        <h1 className="text-center my-4">Listado de Productos</h1>
        <TablaProductos />
      </div>
    </Context>
  );
};

export default ListaProductos;

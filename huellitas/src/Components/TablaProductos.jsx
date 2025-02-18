import { useEffect } from "react";
import { useProductState } from "../Context/Context";
import Swal from "sweetalert2";

const TablaProductos = () => {
  const { state, dispatch } = useProductState();

  useEffect(() => {
    const fetchProducts = async () => {
      //   const response = await fetch(
      //     "https://jsonplaceholder.typicode.com/posts"
      //   );
      //   let data = await response.json();
      const data = [
        { id: 1, nombre: "Alojamiento estándar" },
        { id: 2, nombre: "Alojamiento doble" },
        { id: 3, nombre: "Alojamiento deluxe" },
      ];
      dispatch({ type: "SET_PRODUCTS", payload: data });
    };

    fetchProducts();
  }, [dispatch]);

  console.log(state);
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, elimínalo!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado!",
          text: "El registro fue eliminado.",
          icon: "success",
        });
        dispatch({ type: "DELETE_PRODUCT", payload: id });
      }
    });
  };

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {state.products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.nombre}</td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(product.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaProductos;

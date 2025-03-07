import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ServiceTable = ({ servicios, busqueda, handleEdit, handleDelete, categorias }) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    {servicios
        .filter((servicio) =>
            servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        .map((servicio) => {
            const categoriaId = servicio.categoria ? servicio.categoria.id : null;
            const categoriaNombre = servicio.categoria ? servicio.categoria.nombre : "Categoría no encontrada";

            return (
                <tr key={servicio.id}>
                    <td>{servicio.id}</td>
                    <td>{servicio.nombre}</td>
                    <td>{servicio.descripcion}</td>
                    <td>${servicio.precio}</td>
                    <td>{categoriaNombre}</td>
                    <td>
                        {servicio.imagenUrl ? (
                            <img src={servicio.imagenUrl} alt="Servicio" className="preview-img-table" />
                        ) : (
                            "No hay imagen"
                        )}
                    </td>
                    <td>
                        <FaEdit className="edit-icon" onClick={() => handleEdit(servicio)} />
                        <FaTrash className="delete-icon" onClick={() => handleDelete(servicio.id)} />
                    </td>
                </tr>
            );
        })}
</tbody>

            </table>
        </div>
    );
};

export default ServiceTable;
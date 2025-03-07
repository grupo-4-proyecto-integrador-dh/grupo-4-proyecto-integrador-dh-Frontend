import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ServiceTable = ({ servicios, busqueda, handleEdit, handleDelete, categorias }) => {
    // Asegurar que busqueda nunca sea null o undefined
    const busquedaLimpia = busqueda ? busqueda.toLowerCase() : "";

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                            servicio.nombre && servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
=======
                            servicio.nombre?.toLowerCase().includes(busquedaLimpia)
>>>>>>> Stashed changes
=======
                            servicio.nombre?.toLowerCase().includes(busquedaLimpia)
>>>>>>> Stashed changes
                        )
                        .map((servicio) => {
                            const categoriaNombre = servicio.categoria?.nombre || "Categoría no encontrada";

                            return (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.descripcion}</td>
                                    <td>${servicio.precio}</td>
                                    <td>{categoriaNombre}</td>
                                    <td>
                                        {servicio.imagenUrl ? (
                                            <img src={servicio.imagenUrl} alt="Servicio" className="preview-img-table" />
=======
=======
>>>>>>> Stashed changes
                                    <td>{servicio.nombre || "Nombre no disponible"}</td>
                                    <td>{servicio.descripcion || "Sin descripción"}</td>
                                    <td>${servicio.precio ?? "No especificado"}</td>
                                    <td>{categoriaNombre}</td>
                                    <td>
                                        {servicio.imagenUrl ? (
                                            <img
                                                src={servicio.imagenUrl}
                                                alt="Servicio"
                                                className="preview-img-table"
                                            />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                                        ) : (
                                            "No hay imagen"
                                        )}
                                    </td>
                                    <td>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                                        <FaEdit
                                            className="edit-icon"
                                            onClick={() => handleEdit(servicio)}
                                            title="Editar"
                                        />
                                        <FaTrash
                                            className="delete-icon"
                                            onClick={() => handleDelete(servicio.id)}
                                            title="Eliminar"
                                        />
=======
                                        <FaEdit className="edit-icon" onClick={() => handleEdit(servicio)} />
                                        <FaTrash className="delete-icon" onClick={() => handleDelete(servicio.id)} />
>>>>>>> Stashed changes
=======
                                        <FaEdit className="edit-icon" onClick={() => handleEdit(servicio)} />
                                        <FaTrash className="delete-icon" onClick={() => handleDelete(servicio.id)} />
>>>>>>> Stashed changes
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

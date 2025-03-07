import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

const UserModal = ({
    modalAbierto,
    toggleModal,
    nombre,
    setNombre,
    email,
    setEmail,
    rol,
    setRol,
    agregarUsuario,
    usuarioEditando,
    setUsuarios,
}) => {
    const [localNombre, setLocalNombre] = useState(nombre);
    const [localEmail, setLocalEmail] = useState(email);
    const [localRol, setLocalRol] = useState(rol);

    useEffect(() => {
        setLocalNombre(nombre);
        setLocalEmail(email);
        setLocalRol(rol);
    }, [nombre, email, rol]);

    useEffect(() => {
        if (modalAbierto) {
            Swal.fire({
                title: usuarioEditando ? "Editar Usuario" : "Agregar Usuario",
                html: `
                    <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${localNombre}">
                    <input id="swal-input-email" class="swal2-input" placeholder="Email" value="${localEmail}">
                    <select id="swal-input-rol" class="swal2-input">
                        <option value="USER" ${localRol === "USER" ? "selected" : ""}>Usuario</option>
                        <option value="ADMIN" ${localRol === "ADMIN" ? "selected" : ""}>Administrador</option>
                    </select>
                `,
                showCancelButton: true,
                confirmButtonText: "Guardar",
                cancelButtonText: "Cancelar",
                preConfirm: () => {
                    return {
                        nombre: document.getElementById("swal-input-nombre").value,
                        email: document.getElementById("swal-input-email").value,
                        rol: document.getElementById("swal-input-rol").value,
                    };
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    const { nombre, email, rol } = result.value;
                    if (usuarioEditando && rol !== localRol) {
                        // Cambiar rol si es diferente
                        api.put(`/usuarios/${usuarioEditando}/rol/${rol}`)
                            .then(() => {
                                Swal.fire("Rol Actualizado", "El rol del usuario ha sido actualizado correctamente.", "success");
                                api.get("/usuarios").then((response) => setUsuarios(response.data)); // Actualiza la lista de usuarios
                                toggleModal();
                            })
                            .catch((error) => {
                                console.error("Error al actualizar el rol del usuario:", error);
                                Swal.fire("Error", "No se pudo actualizar el rol del usuario.", "error");
                            });
                    } else {
                        setNombre(nombre);
                        setEmail(email);
                        setRol(rol);
                        agregarUsuario();
                        toggleModal();
                    }
                } else {
                    toggleModal();
                }
            });
        }
    }, [modalAbierto, toggleModal, agregarUsuario, usuarioEditando, localNombre, localEmail, localRol, setNombre, setEmail, setRol, setUsuarios]);

    return null;
};

export default UserModal;
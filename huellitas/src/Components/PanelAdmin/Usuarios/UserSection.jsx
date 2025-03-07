import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import TopBar from "./TopBar";
import "../../../Styles/Administracion.css";
import axios from "axios";

const api = axios.create({
    baseURL: "https://insightful-patience-production.up.railway.app",
});

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [emailUsuario, setEmailUsuario] = useState("");
    const [rolUsuario, setRolUsuario] = useState("");

    useEffect(() => {
        api.get("/usuarios")
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar los usuarios:", error);
            });
    }, []);

    const toggleModalUsuario = () => {
        if (modalUsuarioAbierto) {
            setNombreUsuario("");
            setEmailUsuario("");
            setRolUsuario("");
            setUsuarioEditando(null);
        }
        setModalUsuarioAbierto(!modalUsuarioAbierto);
    };

    const agregarUsuario = () => {
        const usuarioData = {
            nombre: nombreUsuario,
            email: emailUsuario,
            rol: rolUsuario,
        };

        if (usuarioEditando) {
            api.put(`/usuarios/${usuarioEditando}`, usuarioData) // Corregido
                .then(() => {
                    Swal.fire("Usuario Actualizado", "El usuario ha sido actualizado correctamente.", "success");
                    api.get("/usuarios").then((response) => setUsuarios(response.data));
                })
                .catch((error) => {
                    console.error("Error al actualizar el usuario:", error);
                    console.log("Error Response:", error.response); // Agrega esta línea
                    Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
                });
        } else {
            api.post("/usuarios", usuarioData)
                .then(() => {
                    Swal.fire("Usuario Agregado", "El usuario ha sido agregado correctamente.", "success");
                    api.get("/usuarios").then((response) => setUsuarios(response.data));
                })
                .catch((error) => {
                    console.error("Error al agregar el usuario:", error);
                    console.log("Error Response:", error.response); // Agrega esta línea
                    Swal.fire("Error", "No se pudo agregar el usuario.", "error");
                });
        }
    };

    const handleDeleteUsuario = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/usuarios/${id}`)
                    .then(() => {
                        Swal.fire("Eliminado", "El usuario ha sido eliminado correctamente.", "success");
                        api.get("/usuarios").then((response) => setUsuarios(response.data));
                    })
                    .catch((error) => {
                        console.error("Error al eliminar el usuario:", error);
                        console.log("Error Response:", error.response); // Agrega esta línea
                        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
                    });
            }
        });
    };

    const handleEditUsuario = (usuario) => {
        Swal.fire({
            title: "¿Quieres editar este usuario?",
            text: `Estás editando: ${usuario.nombre}`,
            icon: "info",
            iconColor: "#f4e3c1",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar",
            customClass: {
                popup: "mi-popup",
                title: "mi-titulo",
                content: "mi-contenido",
                confirmButton: "mi-boton-confirmar",
                cancelButton: "mi-boton-cancelar",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setNombreUsuario(usuario.nombre || "");
                setEmailUsuario(usuario.email || "");
                setRolUsuario(usuario.rol || "");
                setUsuarioEditando(usuario.id || null);
                setModalUsuarioAbierto(true);
            }
        });
    };

    return (
        <div className="main-content">
            <TopBar toggleModal={toggleModalUsuario} />
            <UserTable
                usuarios={usuarios}
                handleEdit={handleEditUsuario}
                handleDelete={handleDeleteUsuario}
            />
            <UserModal
                modalAbierto={modalUsuarioAbierto}
                toggleModal={toggleModalUsuario}
                nombre={nombreUsuario}
                setNombre={setNombreUsuario}
                email={emailUsuario}
                setEmail={setEmailUsuario}
                rol={rolUsuario}
                setRol={setRolUsuario}
                agregarUsuario={agregarUsuario}
                usuarioEditando={usuarioEditando}
                setUsuarios={setUsuarios}
            />
        </div>
    );
};

export default Usuarios;
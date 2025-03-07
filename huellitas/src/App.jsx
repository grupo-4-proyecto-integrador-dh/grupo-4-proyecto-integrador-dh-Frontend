import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Home from "./Routes/Home";
import PanelAdmin from "./Routes/PanelAdmin";
import Detalle from "./Routes/Detalle";
import Layout from "./Layouts/Layout";
import NotFoundPage from "./Components/NotFoundPage";
import axios from "axios";
import Registro from "./Routes/Registro";
import Login from "./Routes/Login";
import "./Styles/index.css";


function App() {
  const [rolUsuario, setRolUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || sessionStorage.getItem("token"));
  const ROL_URL = "https://insightful-patience-production.up.railway.app/usuarios/rol";

  useEffect(() => {
      if (token) {
          axios.get(ROL_URL, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          })
              .then((rolResponse) => {
                  setRolUsuario(rolResponse.data);
              })
              .catch((rolError) => {
                  console.error("Error al obtener el rol:", rolError);
              });
      }
  }, [token]);



  return (
      <>
          <Routes>
              <Route path="/" element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/login" element={<Login setToken={setToken} />} />
                  <Route path="/administracion" element={<PanelAdmin />} />
                  <Route path="/alojamiento/:id" element={<Detalle />} />
                  <Route path="*" element={<NotFoundPage />} />
              </Route>
          </Routes>
      </>
  );
}

export default App;

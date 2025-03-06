import { Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import PanelAdmin from "./Routes/PanelAdmin";
import Detalle from "./Routes/Detalle";
import Layout from "./Layouts/Layout";
import NotFoundPage from "./Components/NotFoundPage";

import PrivateRoute from "./Routes/PrivateRoute";

import Registro from "./Routes/Registro";
import Login from "./Routes/Login";
import "./Styles/index.css";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<PrivateRoute />}> {/*Aca se ponen los paths que se necesita estar loggeado si o si*/ }
          <Route path="/administracion" element={<PanelAdmin />} />
          <Route path="/alojamiento/:id" element={<Detalle />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

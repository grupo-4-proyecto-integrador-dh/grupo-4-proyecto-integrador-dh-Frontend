import { Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import PanelAdmin from "./Routes/PanelAdmin";
import Detalle from "./Routes/Detalle";
import Layout from "./Layouts/Layout";
import NotFoundPage from "./Components/NotFoundPage";
import Registro from "./Routes/Registro";
import ListaProductos from "./Routes/ListaProductos";
import Header from "./Components/Header";

import "./Styles/index.css";

function App() {
  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="administracion" element={<PanelAdmin />} />
        <Route path="alojamiento/:id" element={<Detalle />} />
        <Route path="lista" element={<ListaProductos />} />
        <Route path="detalle" element={<Detalle />} />
        <Route path="registro" element={<Registro />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>

  );
}

export default App;

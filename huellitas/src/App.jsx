import { Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import PanelAdmin from "./Routes/PanelAdmin";
import Detalle from "./Routes/Detalle";
import Layout from "./Layouts/Layout";
import NotFoundPage from "./Components/NotFoundPage";
import Registro from "./Routes/Registro";
import Login from "./Routes/Login";
import ProtectedRoute from "./Routes/ProtectedRoute";
import RegistroReserva from "./Routes/RegistroReserva";
import ReservaPage from "./Routes/ReservaPage";
import "./Styles/index.scss";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/administracion"
            element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
          >
            <Route index element={<PanelAdmin />} />
          </Route>
          <Route path="/alojamiento/:id" element={<Detalle />} />
          <Route path="/reserva" element={<ReservaPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/registro-reserva" element={<RegistroReserva />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

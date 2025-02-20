import ApartadoBusqueda from "../Components/Home/ApartadoBusqueda";
import CategoriasAlojamientos from "../Components/Home/CategoriasAlojamientos";
import RecomendacionesAlojamientos from "../Components/Home/RecomendacionesAlojamientos";
import "../Styles/App.css";
import "../Styles/Home.scss";

const Home = () => {
  return (
    <div className="w-100">
      <ApartadoBusqueda />
      <CategoriasAlojamientos />
      <RecomendacionesAlojamientos />
    </div>
  );
};

export default Home;

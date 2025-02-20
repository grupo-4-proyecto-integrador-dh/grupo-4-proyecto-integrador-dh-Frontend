import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import "../Styles/Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <header>
        <Header />
      </header>
      <main className="content">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;

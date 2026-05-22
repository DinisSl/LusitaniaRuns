import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Header/>
    <main className="grow flex flex-col">
      <Outlet/>
    </main>
    <Footer/>
  </div>
);

export default Layout;
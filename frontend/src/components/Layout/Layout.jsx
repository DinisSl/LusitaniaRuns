import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import BreadCrumb from "./BreadCrumb.jsx";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/*<BreadCrumb />*/}
      <main className="grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
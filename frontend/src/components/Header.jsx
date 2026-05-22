import NavMenu from "@/components/NavMenu.jsx";
import LoginManager from "@/components/LoginManager.jsx";
import Counter from "@/components/Counter.jsx";
import {useLocation} from "react-router-dom";

const Header = ({ race }) => {
    const location = useLocation();

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="grid grid-cols-3 mx-auto px-6 py-3">
        <NavMenu/>

        <div className="flex justify-center">
          {location.pathname.startsWith('/race/') && <Counter race={race} />}
        </div>

        <div className="flex justify-end"><LoginManager/></div>
      </div>
    </header>
  );
};

export default Header;
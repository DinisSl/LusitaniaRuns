import NavMenu from "@/components/NavMenu.jsx";
import LoginManager from "@/components/LoginManager.jsx";
import Counter from "@/components/Counter.jsx";
import Switch from "./DarkModeSwitch.jsx"; // Verifica se o caminho está correto
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="w-full border-b border-border bg-background">
      {/* Adicionado items-center para alinhar tudo verticalmente */}
      <div className="grid grid-cols-3 mx-auto px-6 py-3 items-center">
        <NavMenu />

        <div className="flex justify-center">
          {location.pathname.startsWith("/race/") && <Counter />}
        </div>

        {/* Adicionado items-center e gap-4 para separar o LoginManager do Switch */}
        <div className="flex justify-end items-center gap-4">
          <LoginManager />
          <Switch />
        </div>
      </div>
    </header>
  );
};

export default Header;
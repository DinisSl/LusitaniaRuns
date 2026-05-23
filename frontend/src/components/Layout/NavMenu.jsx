import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.jsx";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NavMenu = () => {
  const { user } = useAuth();
  const location = useLocation();

  const triggerStyle = "px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors";
  return (
    <nav className="flex items-center gap-2">

      {/*Não mostrar o botão Home se não estivermos na Homepage*/}
      {location.pathname !== '/' && (
        <Link to="/" className={triggerStyle}>Home</Link>
      )}

      {/*Botão exclusivo para o admin*/}
      {user?.is_staff && (
        <Link to="/admin" className={triggerStyle}>Participantes</Link>
      )}

      {/*Se estivermos na homepage mostrar Minhas Inscrições*/}
      {/*se não mas se tivermos numa pagina de uma corrida mostrar as varias Inscrições*/}
      {location.pathname === '/' ? (
        <Link to="/mysignups" className={triggerStyle}>
          Minhas Inscrições
        </Link>
      ) : location.pathname.startsWith('/race/') ? (
        <DropdownMenu>
          <DropdownMenuTrigger className={triggerStyle}>
            Inscrições
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to="/runnersignup" className="w-full cursor-pointer">Inscrição Corredor</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/volunteersignup" className="w-full cursor-pointer">Inscrição Voluntário</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}


    </nav>
  );
}

export default NavMenu;
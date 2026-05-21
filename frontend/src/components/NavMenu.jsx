import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const NavMenu = () => {
  const URL_RACES = 'http://localhost:8000/race/api/races/';
  const URL_USER = 'http://localhost:8000/race/api/user/';
  const [races, setRaces] = useState([]);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    axios.get(URL_RACES)
      .then((response) => setRaces(response.data))
      .catch(() => console.log('erro ao ir buscar as corridas'));
  }, []);

  useEffect(() => {
    axios.get(URL_USER, { withCredentials: true })
      .then((response) => setIsStaff(response.data.is_staff))
      .catch(() => console.log('user not Staff'));
  }, []);

  const triggerStyle = "px-4 py-2 text-sm font-medium border rounded-lg hover:bg-slate-100 transition-colors";

  return (
    <nav className="flex items-center gap-2">

      <DropdownMenu>
        <DropdownMenuTrigger className={triggerStyle}>
          Corridas
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {races.map((race) => (
            <DropdownMenuItem key={race.id} asChild>
              <Link to={`/race/${race.id}`} className="w-full cursor-pointer">
                {race.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Link to="/" className={triggerStyle}>
        Home
      </Link>

      {isStaff && (
        <Link to="/admin" className={triggerStyle}>
          Participantes
        </Link>
      )}

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

    </nav>
  );
}

export default NavMenu;
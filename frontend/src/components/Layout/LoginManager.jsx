import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const URL_LOGOUT = 'http://localhost:8000/race/api/logout/';

const LoginManager = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    axios.get(URL_LOGOUT, { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate('/');
      })
      .catch(() => console.log('logout failed'));
  };

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <p className="text-sm text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{user.first_name} {user.last_name}</span>
          </p>
          <Button onClick={handleLogout} variant="destructive" className="h-auto px-3 py-1.5">
            Logout
          </Button>
          <Button onClick={() => navigate("/profile")} className="h-auto px-3 py-1.5">
            Profile
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Olá, não estás logado(a)!</p>
          <Button onClick={() => navigate('/login')} className="h-auto px-3 py-1.5">
            Login
          </Button>
          <Button onClick={() => navigate('/signup')} variant="outline" className="h-auto px-3 py-1.5">
            Signup
          </Button>
        </>
      )}
    </div>
  );
};

export default LoginManager;
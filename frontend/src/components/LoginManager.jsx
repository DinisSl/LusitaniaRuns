import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button.jsx";

const LoginManager = () => {
  const navigate = useNavigate();

  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);

  const URL_USER = 'http://localhost:8000/race/api/user/';
  const URL_LOGOUT = 'http://localhost:8000/race/api/logout/';

  useEffect(() => {
    axios
      .get(URL_USER, { withCredentials: true })
      .then((response) => {
        setFirstName(response.data.first_name)
        setLastName(response.data.last_name)
      }
      )
      .catch(() =>
        console.log('user not logged in')
      );
  }, []);

  const handleLogout = () => {
    axios
      .get(URL_LOGOUT, { withCredentials: true })
      .then(() => {
        setFirstName(null);
        setLastName(null);
        navigate('/');
      })
      .catch(() =>
        console.log('logout failed')
      );
  };

  return (
    <div className="flex items-center gap-3">
      {first_name && last_name ? (
        <>
          <p className="text-sm text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{first_name} {last_name}</span>
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
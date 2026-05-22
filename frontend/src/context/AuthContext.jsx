import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const URL_USER = "http://localhost:8000/race/api/user/";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const refresh = () =>
    axios.get(URL_USER, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));

  useEffect(() => { refresh(); }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
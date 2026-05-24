import { BrowserRouter, Routes, Route} from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Admin from "./pages/Admin.jsx";
import Profile from "./pages/Profile.jsx";
import Race from "./pages/Race.jsx";
import MySignups from "./pages/MySignups.jsx";

import Layout from "./components/Layout/Layout.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<Layout/>}>
          <Route index element={<Homepage/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/race/:id" element={<Race/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/mysignups" element={<MySignups/>}/>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
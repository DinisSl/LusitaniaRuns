import { BrowserRouter, Routes, Route} from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Admin from "./pages/Admin.jsx";
import Profile from "./pages/Profile.jsx";
import Race from "./pages/Race.jsx";
import MySignups from "./pages/MySignups.jsx";

import Layout from "./components/Layout/Layout.jsx";
import { AuthProvider } from "@/context/AuthContext.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<Layout/>}>
          <Route index element={<Homepage/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/race/:id" element={<Race/>}/>

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }/>

          <Route path="/mysignups" element={
            <ProtectedRoute>
              <MySignups/>
            </ProtectedRoute>
          }/>

          <Route path="/admin" element={
            <ProtectedRoute requireStaff={true}>
              <Admin/>
            </ProtectedRoute>
          }/>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
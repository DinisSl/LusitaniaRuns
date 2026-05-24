import AdminLogic from "@/components/AdminLogic.jsx";
import {useAuth} from "@/context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";


const Admin = () => {
    return(
        <>
      <AdminLogic/>
        </>
    );

}

export default Admin
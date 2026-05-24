import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireStaff = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Não autenticado
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] px-4">
        <Card className="w-full max-w-sm text-center shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Acesso negado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Tens de estar autenticado para aceder a esta página.
            </p>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Iniciar sessão
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Autenticado mas sem permissões de staff
  if (requireStaff && !user.is_staff) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] px-4">
        <Card className="w-full max-w-sm text-center shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Sem permissões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Não tens permissões para aceder a esta página.
            </p>
            <Button className="w-full" onClick={() => navigate("/")}>
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
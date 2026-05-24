import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SignupList from "@/components/SignupList.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MySignups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[40vh] px-4">
          <Card className="w-full max-w-sm text-center shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-destructive">Acesso negado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tens de estar autenticado para ver as tuas inscrições.
              </p>
              <Button className="w-full" onClick={() => navigate("/login")}>
                Iniciar sessão
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-4/5 mx-auto px-4 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">As minhas inscrições</h2>
          {user.firstName && (
            <p className="text-muted-foreground mt-1">
              Olá, <span className="font-semibold text-foreground">{user.firstName}</span>! Aqui encontras todas as tuas inscrições em corridas.
            </p>
          )}
        </div>
        <hr className="border-border" />
        <SignupList />
      </div>
    </>
  );
};

export default MySignups;

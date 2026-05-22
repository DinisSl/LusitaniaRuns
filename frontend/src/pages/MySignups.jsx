import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "@/components/Header.jsx";
import SignupList from "@/components/SignupList.jsx";
import Footer from "@/components/Footer.jsx";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const URL_USER = "http://localhost:8000/race/api/user/";

const MySignups = () => {
  const [firstName, setFirstName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(URL_USER, { withCredentials: true })
      .then((res) => {
        setFirstName(res.data.first_name);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Não autenticado:", err);
        setAuthError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground animate-pulse">A carregar...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (authError) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">As minhas inscrições</h2>
          {firstName && (
            <p className="text-muted-foreground mt-1">
              Olá, <span className="font-semibold text-foreground">{firstName}</span>! Aqui encontras todas as tuas inscrições em corridas.
            </p>
          )}
        </div>
        <hr className="border-border" />
        <SignupList />
      </div>
      <Footer />
    </>
  );
};

export default MySignups;

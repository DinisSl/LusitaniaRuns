import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ROLES } from "@/pages/Race";

const URL_RUNNERSIGNUPS = "http://localhost:8000/race/api/my-runnersignups/";
const URL_VOLUNTEERSIGNUPS = "http://localhost:8000/race/api/my-volunteersignups/";

const getCSRFToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];

const StateBadge = ({ state }) => {
  const normalized = state?.toUpperCase();

  switch (normalized) {
    case "APROVADO":
      return <Badge className="bg-green-600 hover:bg-green-600 text-white">Aprovado</Badge>;
    case "REJEITADO":
      return <Badge variant="destructive">Rejeitado</Badge>;
    case "PENDENTE":
    default:
      return <Badge variant="secondary">Pendente</Badge>;
  }
};

const EmptyRow = ({ cols, message }) => (
  <TableRow>
    <TableCell colSpan={cols} className="text-center text-muted-foreground py-6">
      {message}
    </TableCell>
  </TableRow>
);

const SignupList = () => {
  const [runners, setRunners] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);

    Promise.all([
      axios.get(URL_RUNNERSIGNUPS, { withCredentials: true }),
      axios.get(URL_VOLUNTEERSIGNUPS, { withCredentials: true }),
    ])
      .then(([runnerRes, volunteerRes]) => {
        setRunners(runnerRes.data.results ?? runnerRes.data);
        setVolunteers(volunteerRes.data.results ?? volunteerRes.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar inscrições:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cancelSignup = (url, id) => {
    axios.delete(`${url}${id}/`, {
      headers: { "X-CSRFToken": getCSRFToken() },
      withCredentials: true,
    })
      .then(() => fetchData())
      .catch((err) => console.error("Erro ao cancelar inscrição:", err));
  };

  if (loading) {
    return (
      <p className="text-muted-foreground animate-pulse py-6 text-center">
        A carregar inscrições...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-destructive py-6 text-center">
        Ocorreu um erro ao carregar as inscrições. Tenta novamente mais tarde.
      </p>
    );
  }

  return (
    <div className="space-y-8">

      {/* Corredores */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Inscrições como Corredor</h3>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Corrida</TableHead>
                <TableHead className="text-center">Classificação</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead>Comentário do Admin</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runners.length === 0 ? (
                <EmptyRow cols={5} message="Sem inscrições como corredor." />
              ) : (
                runners.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.race_name}</TableCell>
                    <TableCell className="text-center">{r.classification ?? "—"}</TableCell>
                    <TableCell className="text-center">
                      <StateBadge state={r.state} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.adminComment || "—"}</TableCell>
                    <TableCell className="text-center">
                      {r.state?.toLowerCase() !== "cancelado" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Cancelar</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar inscrição?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser revertida. A tua inscrição será permanentemente removida.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelSignup(URL_RUNNERSIGNUPS, r.id)}>
                                Cancelar inscrição
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Voluntários */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Inscrições como Voluntário</h3>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Corrida</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead>Comentário do Admin</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.length === 0 ? (
                <EmptyRow cols={5} message="Sem inscrições como voluntário." />
              ) : (
                volunteers.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.race_name}</TableCell>
                    <TableCell>{ROLES[v.role] || v.role}</TableCell>
                    <TableCell className="text-center">
                      <StateBadge state={v.state} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.adminComment || "—"}</TableCell>
                    <TableCell className="text-center">
                      {v.state?.toLowerCase() !== "cancelado" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Cancelar</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar inscrição?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser revertida. A tua inscrição será permanentemente removida.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelSignup(URL_VOLUNTEERSIGNUPS, v.id)}>
                                  Cancelar inscrição
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
};

export default SignupList;
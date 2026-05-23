import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const getCSRFToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];

const AdminLogic = () => {
  const [participantesCorredores, setParticipantes] = useState([]);
  const [participantesVoluntarios, setVoluntarios] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogComment, setDialogComment] = useState("");
  const [dialogId, setDialogId] = useState(null);
  const [dialogIsRunner, setDialogIsRunner] = useState(true);

  const URL_RUNNERSIGUPS = "http://localhost:8000/race/api/runnersignups/";
  const URL_VOLUNTEERSIGUPS = "http://localhost:8000/race/api/volunteersignups/";

  useEffect(() => {
    axios
      .get(URL_RUNNERSIGUPS, { withCredentials: true })
      .then((response) => {
        const data = response.data.results ? response.data.results : response.data;
        setParticipantes(data);
      })
      .catch((error) => console.error("Erro corredores:", error));
  }, []);

  useEffect(() => {
    axios
      .get(URL_VOLUNTEERSIGUPS, { withCredentials: true })
      .then((response) => {
        const data = response.data.results ? response.data.results : response.data;
        setVoluntarios(data);
      })
      .catch((error) => console.error("Erro voluntários:", error));
  }, []);

  const handleUpdateState = async (id, newState, isRunner) => {
    const url = isRunner ? `${URL_RUNNERSIGUPS}${id}/` : `${URL_VOLUNTEERSIGUPS}${id}/`;
    try {
      await axios.put(
        url,
        { state: newState },
        {
          withCredentials: true,
          headers: { "X-CSRFToken": getCSRFToken() },
        }
      );
      if (isRunner) {
        setParticipantes((prev) => prev.map((p) => (p.id === id ? { ...p, state: newState } : p)));
      } else {
        setVoluntarios((prev) => prev.map((v) => (v.id === id ? { ...v, state: newState } : v)));
      }
    } catch (error) {
      console.error("Erro ao atualizar estado:", error);
    }
  };

  const handleUpdateClassification = async (id, newClassification) => {
    try {
      await axios.put(
        `${URL_RUNNERSIGUPS}${id}/`,
        { classification: newClassification },
        {
          withCredentials: true,
          headers: { "X-CSRFToken": getCSRFToken() },
        }
      );
      setParticipantes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, classification: newClassification } : p))
      );
    } catch (error) {
      console.error("Erro ao atualizar classificação:", error);
    }
  };

  const handleUpdateComment = async (id, newComment, isRunner) => {
    const url = isRunner ? `${URL_RUNNERSIGUPS}${id}/` : `${URL_VOLUNTEERSIGUPS}${id}/`;
    try {
      await axios.put(
        url,
        { adminComment: newComment },
        {
          withCredentials: true,
          headers: { "X-CSRFToken": getCSRFToken() },
        }
      );
      if (isRunner) {
        setParticipantes((prev) =>
          prev.map((p) => (p.id === id ? { ...p, adminComment: newComment } : p))
        );
      } else {
        setVoluntarios((prev) =>
          prev.map((v) => (v.id === id ? { ...v, adminComment: newComment } : v))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    }
  };

  const openEditDialog = (id, currentComment, isRunner) => {
    setDialogId(id);
    setDialogComment(currentComment || "");
    setDialogIsRunner(isRunner);
    setDialogOpen(true);
  };

  const saveComment = () => {
    if (dialogId !== null) {
      handleUpdateComment(dialogId, dialogComment, dialogIsRunner);
      setDialogOpen(false);
    }
  };

  const StateBadge = ({ state }) => {
    switch (state) {
      case "APROVADO":
        return <Badge className="bg-green-600 hover:bg-green-600 text-white">Aprovado</Badge>;
      case "REJEITADO":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "PENDENTE":
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getApprovedCount = (raceName) => {
    return participantesCorredores.filter((r) => r.race_name === raceName && r.state === "APROVADO").length;
  };

  return (
    <div className="p-6 space-y-10">
      {/* Tabela de Corredores */}
      <div>
        <h2 className="text-xl font-bold mb-4">Inscrições de Corredores</h2>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>Corrida</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesCorredores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum participante encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                participantesCorredores.map((runner) => (
                  <TableRow key={runner.id}>
                    <TableCell className="font-medium">{runner.user_name}</TableCell>
                    <TableCell>{runner.race_name}</TableCell>
                    <TableCell>
                      {runner.state === "APROVADO" ? (
                        <Select
                          value={runner.classification ? String(runner.classification) : undefined}
                          onValueChange={(val) => handleUpdateClassification(runner.id, val)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="N/A" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: getApprovedCount(runner.race_name) }, (_, i) => i + 1).map(
                              (num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num}º
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StateBadge state={runner.state} />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{runner.adminComment || "—"}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(runner.id, runner.adminComment, true)}
                        >
                          ✏️
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => handleUpdateState(runner.id, "APROVADO", true)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateState(runner.id, "REJEITADO", true)}
                      >
                        Rejeitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tabela de Voluntários */}
      <div>
        <h2 className="text-xl font-bold mb-4">Inscrições de Voluntários</h2>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voluntário</TableHead>
                <TableHead>Corrida</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesVoluntarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum voluntário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                participantesVoluntarios.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">{volunteer.user_name}</TableCell>
                    <TableCell>{volunteer.race_name}</TableCell>
                    <TableCell>{volunteer.role}</TableCell>
                    <TableCell>
                      <StateBadge state={volunteer.state} />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{volunteer.adminComment || "—"}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(volunteer.id, volunteer.adminComment, false)}
                        >
                          ✏️
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => handleUpdateState(volunteer.id, "APROVADO", false)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateState(volunteer.id, "REJEITADO", false)}
                      >
                        Rejeitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog para editar comentário */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar comentário</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={dialogComment}
              onChange={(e) => setDialogComment(e.target.value)}
              placeholder="Escreva aqui o comentário sobre a inscrição..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveComment}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLogic;
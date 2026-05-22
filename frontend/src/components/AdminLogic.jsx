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
import { Badge } from "@/components/ui/badge"; // Importa o Badge
import { Button } from "@/components/ui/button"; // Importa o Button

const getCSRFToken = () =>
      document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];


const AdminLogic = () => {
  const [participantesCorredores, setParticipantes] = useState([]);
  const [participantesVoluntarios, setVoluntarios] = useState([]);
  const URL_RUNNERSIGUPS = 'http://localhost:8000/race/api/runnersignups/';
  const URL_VOLUNTEERSIGUPS = 'http://localhost:8000/race/api/volunteersignups/';

  useEffect(() => {
    axios.get(URL_RUNNERSIGUPS, { withCredentials: true })
      .then((response) => {
        const data = response.data.results ? response.data.results : response.data;
        setParticipantes(data);
      })
      .catch((error) => console.error('Erro corredores:', error));
  }, []);

  useEffect(() => {
    axios.get(URL_VOLUNTEERSIGUPS, { withCredentials: true })
      .then((response) => {
        const data = response.data.results ? response.data.results : response.data;
        setVoluntarios(data);
      })
      .catch((error) => console.error('Erro voluntários:', error));
  }, []);

  const handleUpdateState = async (id, newState, isRunner) => {
  const url = isRunner ? `${URL_RUNNERSIGUPS}${id}/` : `${URL_VOLUNTEERSIGUPS}${id}/`;
  try {

    await axios.put(url, { state: newState }, {withCredentials: true,
      headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  }
);

    if (isRunner) {
      setParticipantes(prev => prev.map(p => p.id === id ? { ...p, state: newState } : p));
    } else {
      setVoluntarios(prev => prev.map(v => v.id === id ? { ...v, state: newState } : v));
    }
  } catch (error) {
    console.error('Erro ao atualizar estado:', error);
  }
};

  // Componente para renderizar a Badge correta
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

  return (
    <div className="p-6 space-y-10">
      {/* Tabela de Corredores */}
      <div>
        <h2 className="text-xl font-bold mb-4">Inscrições de Corredores</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>Corrida</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesCorredores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum participante encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                participantesCorredores.map((runner) => (
                  <TableRow key={runner.id}>
                    <TableCell className="font-medium">{runner.user_name}</TableCell>
                    <TableCell>{runner.race_name}</TableCell>
                    <TableCell>{runner.classification ?? "N/A"}</TableCell>
                    <TableCell><StateBadge state={runner.state} /></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={() => handleUpdateState(runner.id, "APROVADO", true)}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateState(runner.id, "REJEITADO", true)}>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voluntário</TableHead>
                <TableHead>Corrida</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesVoluntarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum voluntário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                participantesVoluntarios.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">{volunteer.user_name}</TableCell>
                    <TableCell>{volunteer.race_name}</TableCell>
                    <TableCell>{volunteer.role}</TableCell>
                    <TableCell><StateBadge state={volunteer.state} /></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={() => handleUpdateState(volunteer.id, "APROVADO", false)}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateState(volunteer.id, "REJEITADO", false)}>
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
    </div>
  );
}

export default AdminLogic;
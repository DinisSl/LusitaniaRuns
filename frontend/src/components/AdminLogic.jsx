import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Ajuste o caminho conforme a estrutura do seu projeto

const AdminLogic = () => {
  const [participantesCorredores, setParticipantes] = useState([]);
  const [participantesVoluntarios, setVoluntarios] = useState([]);
  const URL_RUNNERSIGUPS = 'http://localhost:8000/race/api/runnersignups/';
  const URL_VOLUNTEERSIGUPS = 'http://localhost:8000/race/api/volunteersignups/';

  useEffect(() => {
  axios.get(URL_RUNNERSIGUPS)
    .then((response) => {
      // Usa response.data.results se houver paginação, senão usa response.data
      const data = response.data.results ? response.data.results : response.data;
      setParticipantes(data);
    })
    .catch((error) => console.error('Erro corredores:', error));
}, []);

useEffect(() => {
  axios.get(URL_VOLUNTEERSIGUPS)
    .then((response) => {
      const data = response.data.results ? response.data.results : response.data;
      setVoluntarios(data);
    })
    .catch((error) => console.error('Erro voluntários:', error));
}, []);

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesCorredores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Nenhum participante encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                participantesCorredores.map((runner) => (
                  <TableRow key={runner.id}>
                    {/* Se o seu serializer nesting o user/profile, aceda via runner.user.name */}
                    <TableCell className="font-medium">{runner.user_name}</TableCell>
                    <TableCell>{runner.race_name}</TableCell>
                    <TableCell>{runner.classification ?? "N/A"}</TableCell>
                    <TableCell>{runner.state}</TableCell>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesVoluntarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Nenhum voluntário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                participantesVoluntarios.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">{volunteer.user_name}</TableCell>
                    <TableCell>{volunteer.race_name}</TableCell>
                    <TableCell>{volunteer.role}</TableCell>
                    <TableCell>{volunteer.state}</TableCell>
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
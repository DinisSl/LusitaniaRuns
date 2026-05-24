import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Description from "../components/Description.jsx";
import RaceTitle from "@/components/RaceTitle.jsx";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const RUNNERSIGNUPS_URL = "http://localhost:8000/race/api/runnersignups/";
const VOLUNTEERSIGNUPS_URL = "http://localhost:8000/race/api/volunteersignups/";

export const ROLES = {
  ENTREGA_DORSAIS: "Entrega de Dorsais",
  APOIO_PARTIDA: "Apoio na Partida",
  COACH_BANCADA: "Coach de Bancada",
  ORIENTACAO: "Orientação",
  ABASTECIMENTOS: "Abastecimentos",
  SEGURANCA: "Segurança",
  PRIMEIROS_SOCORROS: "Primeiros Socorros",
  PACER: "Pacer",
};

const Race = () => {
  const { id } = useParams();
  const [race, setRace] = useState(null);
  const [tipo, setTipo] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8000/race/api/race/${id}/`)
      .then((response) => setRace(response.data))
      .catch((error) => console.error("Erro ao ir buscar os detalhes da corrida: ", error));
  }, [id]);

  const getCSRFToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

  const handleSignup = () => {
    if (tipo === "corredor") {
      axios
        .post(
          RUNNERSIGNUPS_URL,
          { race: id, state: "PENDENTE" },
          {
            headers: { "X-CSRFToken": getCSRFToken() },
            withCredentials: true,
          }
        )
        .then(() => {
          setErro("");
          setSucesso("Inscrição submetida com sucesso!");
          setTimeout(() => navigate("/mysignups"), 1500);
        })
        .catch((error) => setErro(error.response?.data?.msg || "Erro na inscrição"));

    } else if (tipo === "voluntario" && selectedRole) {
      axios
        .post(
          VOLUNTEERSIGNUPS_URL,
          { race: id, role: selectedRole, state: "PENDENTE" },
          {
            headers: { "X-CSRFToken": getCSRFToken() },
            withCredentials: true,
          }
        )
        .then(() => {
          setErro("");
          setSucesso("Inscrição submetida com sucesso!");
          setTimeout(() => navigate("/mysignups"), 1500);
        })
        .catch((error) => setErro(error.response?.data?.msg || "Erro na inscrição"));
    }
  };

  if (!race)
    return <div className="p-8 text-center">A carregar detalhes da corrida...</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-col items-center py-10">
        <RaceTitle race={race} />
        <Description race={race} />
      </div>

      <div className="flex items-center justify-center mb-10">
          <Dialog onOpenChange={() => { setTipo(""); setSelectedRole(""); setErro(""); setSucesso(""); }}>          <DialogTrigger asChild>
            <Button className="cursor-pointer px-8 py-3 text-lg h-auto">
              Inscreve-te agora
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Inscrições</DialogTitle>
              <DialogDescription>
                Escolha se se quer inscrever como corredor ou voluntário
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Tipo de inscrição</Label>
                <Select onValueChange={setTipo} value={tipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolhe o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corredor">Corredor</SelectItem>
                    <SelectItem value="voluntario">Voluntário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipo === "voluntario" && (
                <div className="flex flex-col gap-2">
                  <Label>Função de Voluntário</Label>
                  <Select onValueChange={setSelectedRole} value={selectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolhe uma função..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(ROLES).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {erro && (
              <p className="text-sm text-destructive">{erro}</p>
            )}
            {sucesso && (
              <p className="text-sm text-green-600">{sucesso}</p>
            )}

            <DialogFooter className="sm:justify-start gap-2">
              <Button
                onClick={handleSignup}
                disabled={!tipo || (tipo === "voluntario" && !selectedRole)}
              >
                Inscrever-me
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Race;
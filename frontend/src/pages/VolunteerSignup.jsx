import { useState } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SignupForm from "../components/SignupForm";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";


const VOLUNTEERSIGNUPS_URL = "http://localhost:8000/race/api/volunteersignups/";

const ROLE_OPTIONS = [
  { value: "ENTREGA_DORSAIS", label: "Entrega de Dorsais" },
  { value: "APOIO_PARTIDA", label: "Apoio na Partida" },
  { value: "COACH_BANCADA", label: "Coach de Bancada" },
  { value: "ORIENTACAO", label: "Orientação" },
  { value: "ABASTECIMENTOS", label: "Abastecimentos" },
  { value: "SEGURANCA", label: "Segurança" },
  { value: "PRIMEIROS_SOCORROS", label: "Primeiros Socorros" },
  { value: "PACER", label: "Pacer" },
];

const VolunteerSignup = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const getCSRFToken = () =>
      document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];

  const handleVolunteerSignup = (selectedRace) => {
    if (!selectedRole) return;


    axios.post(VOLUNTEERSIGNUPS_URL, { race: selectedRace, role: selectedRole ,state: "PENDENTE" }, {
      headers: { "X-CSRFToken": getCSRFToken() },
      withCredentials: true,
    })
        .then(() => alert("Inscrição de voluntário submetida!"))
        .catch((error) => console.error("Erro na inscrição:", error));
  };

  const roleSelector = (
      <div className="flex flex-col gap-3">
        <Label>Função de Voluntário</Label>
        <Select onValueChange={setSelectedRole} value={selectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="Escolhe uma função" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
  );

  return (
    <div>
      <Header />
      <div className="p-10 flex items-start justify-center">
        <SignupForm
          signupUrl={VOLUNTEERSIGNUPS_URL}
          title="Inscrição Voluntário"
          extraFields={roleSelector}
          onSignup={handleVolunteerSignup}
        />
      </div>
      <Footer />
    </div>
  );
};

export default VolunteerSignup;
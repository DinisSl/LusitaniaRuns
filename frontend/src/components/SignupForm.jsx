import { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from "@/components/ui/select";

const RACES_URL = "http://localhost:8000/race/api/races/";

const SignupForm = ({ signupUrl, title, extraFields, onSignup }) => {
  const [racesList, setRacesList] = useState([]);
  const [selectedRace, setSelectedRace] = useState("");

  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  };

  const getRaces = () => {
    axios
      .get(RACES_URL, { withCredentials: true })
      .then((response) => setRacesList(response.data))
      .catch((error) => console.error("Erro ao buscar corridas:", error));
  };

  const handleSignup = () => {
    if (!selectedRace) return;
    if (onSignup) {
      onSignup(selectedRace);
      return;
    }

    axios.post(signupUrl, { race: selectedRace,state: "PENDENTE" }, {
      headers: { "X-CSRFToken": getCSRFToken() },
      withCredentials: true,
    })
    .then(() => alert("Inscrição submetida!"))
    .catch((error) => console.error("Erro na inscrição:", error));
  };

  useEffect(() => {
    getRaces();
  }, []);

  return (
    <Card className="w-1/5">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="race">Selecionar Corrida</Label>
          <Select onValueChange={setSelectedRace} value={selectedRace}>
            <SelectTrigger id="race" className="w-full">
              <SelectValue placeholder="Escolha uma corrida..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {racesList.map((race) => (
                  <SelectItem key={race.id} value={race.id.toString()}>
                    {race.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {extraFields}
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={handleSignup} disabled={!selectedRace}>
          Inscrever-me
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Description from "../components/Description.jsx";
import RaceTitle from "@/components/RaceTitle.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

const Race = () => {
  const { id } = useParams();
  const [race, setRace] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/race/api/race/${id}/`)
      .then((response) => setRace(response.data))
      .catch((error) => console.error("Erro ao ir buscar os detalhes da corrida: ", error));
  }, [id]);

  if (!race) return <div className="p-8 text-center">A carregar detalhes da corrida...</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-col items-center py-10">
        <RaceTitle race={race} />
        <Description race={race} />
      </div>
    </div>
  );
}

export default Race;
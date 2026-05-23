import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const calcularTempoRestante = (dataEvento) => {
  const diferenca = dataEvento - new Date();
  if (diferenca <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  return {
    dias: Math.floor(diferenca / 86400000),
    horas: Math.floor((diferenca / 3600000) % 24),
    minutos: Math.floor((diferenca / 60000) % 60),
    segundos: Math.floor((diferenca / 1000) % 60),
  };
};

const Counter = () => {
  const { id } = useParams();
  const [dataEvento, setDataEvento] = useState(null);
  const [tempo, setTempo] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/race/api/race/${id}/`)
      .then((res) => setDataEvento(new Date(res.data.date)))
      .catch((err) => console.error("Erro ao ir buscar a corrida:", err));
  }, [id]);

  useEffect(() => {
    if (!dataEvento) return;
    setTempo(calcularTempoRestante(dataEvento));
    const intervalo = setInterval(
      () => setTempo(calcularTempoRestante(dataEvento)),
      1000
    );
    return () => clearInterval(intervalo);
  }, [dataEvento]);

  if (!tempo) return null;

  return (
    <div className="flex items-center gap-8">
      {[["Dias", tempo.dias], ["Horas", tempo.horas], ["Min", tempo.minutos], ["Seg", tempo.segundos]].map(([label, val]) => (
        <div key={label} className="text-center">
          <span className="block text-3xl font-semibold tabular-nums text-foreground leading-none">
            {String(val).padStart(2, "0")}
          </span>
          <span className="block mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Counter;
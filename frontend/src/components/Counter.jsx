import { useState, useEffect } from "react";

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

const Counter = ({ race }) => {
  const dataEvento = new Date(race.date);
  const [tempo, setTempo] = useState(() => calcularTempoRestante(dataEvento));

  useEffect(() => {
    const intervalo = setInterval(() => setTempo(calcularTempoRestante(dataEvento)), 1000);
    return () => clearInterval(intervalo);
  }, [race.date]);

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
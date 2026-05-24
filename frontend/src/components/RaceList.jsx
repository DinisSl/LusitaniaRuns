import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import Autoplay from 'embla-carousel-autoplay';

const formatarData = (dataIso) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return `${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
};

const RaceList = () => {
  const URL_RACES = "http://localhost:8000/race/api/races/";
  const [racesList, setRacesList] = useState([]);

  const autoplayPlugin = Autoplay({
    delay: 2750,
    stopOnInteraction: true,
    stopOnMouseEnter: false,
  });

  useEffect(() => {
    axios.get(URL_RACES)
      .then((response) => setRacesList(response.data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,            // Volta ao início sem parar
          slidesToScroll: 2,    // Avança 2 cards por vez (ajuste conforme necessário)
        }}
        plugins={[autoplayPlugin]}  // Activa o movimento automático
        className="w-full max-w-6xl px-10"
      >
        <CarouselContent>
          {racesList.map((race) => (
            <CarouselItem key={race.id} className="basis-full md:basis-1/2">
              <div className="p-2 h-full">
                <Link to={`/race/${race.id}`} className="block h-full">
                  <Card className="overflow-hidden h-full flex flex-col p-0 hover:opacity-90 transition-opacity cursor-pointer shadow-sm hover:shadow-md min-h-[400px]">
                    <div className="w-full h-56 m-0 p-0 shrink-0 border-b">
                      <img
                        src={`http://localhost:8000${race.image}`}
                        alt={race.name}
                        className="block w-full h-full object-cover m-0 p-0"
                      />
                    </div>
                    <CardContent className="p-5 flex flex-col gap-2 text-left grow">
                      <h3 className="text-2xl font-bold leading-tight line-clamp-2 break-words">
                        {race.name}
                      </h3>
                      <h6 className="text-lg text-muted-foreground leading-tight line-clamp-2 break-words">
                        {formatarData(race.date)}
                      </h6>
                      <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                        {race.details}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="size-12 [&_svg]:size-6" />
        <CarouselNext className="size-12 [&_svg]:size-6" />
      </Carousel>
    </div>
  );
};

export default RaceList;
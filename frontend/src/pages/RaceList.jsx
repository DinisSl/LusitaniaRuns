import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const RaceList = () => {
  const URL_RACES = "http://localhost:8000/race/api/races/";
  const [racesList, setRacesList] = useState([]);

  useEffect(() => {
    axios.get(URL_RACES)
      .then((response) => setRacesList(response.data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {racesList.map((race) => (
              <CarouselItem key={race.id}>
                <div className="p-1 h-full">

                  <Link to={`/race/${race.id}`} className="block h-full">

                    <Card className="overflow-hidden h-full flex flex-col p-0 hover:opacity-90 transition-opacity cursor-pointer shadow-sm hover:shadow-md">
                      <div className="w-full h-48 m-0 p-0 shrink-0 border-b">
                        <img
                          src={`http://localhost:8000${race.image}`}
                          alt={race.name}
                          className="block w-full h-full object-cover m-0 p-0"
                        />
                      </div>

                      <CardContent className="p-4 flex flex-col gap-2 text-left grow">
                        <h3 className="text-lg font-bold leading-tight">
                          {race.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {race.details}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious/>
          <CarouselNext/>
        </Carousel>
    </div>
  );
}

export default RaceList;
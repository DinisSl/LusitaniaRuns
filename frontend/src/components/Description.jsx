import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const formatarData = (dataIso) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return `${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
};

const Texto = ({ race }) => {
    return (
        <Card id="box1" className="flex-1 bg-card whitespace-pre-wrap text-card-foreground border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">{race.name}</CardTitle>
                <CardDescription className="text-lg font-medium text-muted-foreground">
                    {formatarData(race.date)}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
                <p>{race.details}</p>
            </CardContent>
        </Card>
    )
}

const Imagem = ({ race }) => {
    return (
        <Card id="box2" className="flex-1 flex flex-col overflow-hidden bg-card border-border shadow-sm">
            <img
                src={`http://localhost:8000${race.image}`}
                alt={race.name}
                className="w-full flex-1 object-cover block"
            />
            <div className="p-4">
                <figcaption className="text-xl font-medium text-center text-muted-foreground">
                    {race.name}
                </figcaption>
            </div>
        </Card>
    )
}

const Description = ({ race }) => {
    return (
        <div className="flex flex-row items-stretch gap-6 p-6 w-4/5 mx-auto bg-background text-foreground">
            <Texto race={race} />
            <Imagem race={race} />
        </div>
    )
}

export default Description;
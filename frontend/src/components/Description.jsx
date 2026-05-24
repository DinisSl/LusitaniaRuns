
const Description = ({ race }) => {
  return (
    <div className="flex flex-row gap-10 p-6 w-4/5 mx-auto">
      <div className="flex-1 space-y-3">
        <h2 className="text-3xl font-bold">Informações da corrida</h2>
        <p className="text-lg text-muted-foreground">{race.location}</p>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{race.details}</p>
      </div>
      <div className="flex-1">
        <img
          src={`http://localhost:8000${race.image}`}
          alt={race.name}
          className="w-full rounded-lg object-cover max-h-[400px]"
        />
      </div>
    </div>
  );
};

export default Description;

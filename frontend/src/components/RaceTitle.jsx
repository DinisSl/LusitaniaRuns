
const RaceTitle = ({ race }) => {
  return (
    <div className="text-center space-y-1.5 px-4">
      <h1 className="text-6xl font-semibold tracking-tight text-foreground">
        {race.name}
      </h1>
      <p className="text-2xl text-muted-foreground">
        {new Date(race.date).toLocaleDateString('pt-PT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
  );
};

export default RaceTitle;
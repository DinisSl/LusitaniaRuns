
const RaceTitle = ({ race }) => {
  return (
    <div className="text-center space-y-1.5 px-4">
      <h1 className="text-5xl font-semibold tracking-tight">
        <span className="bg-gradient-to-r from-green-700 via-yellow-500 to-red-600 bg-clip-text text-transparent">
          {race.name}
        </span>
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
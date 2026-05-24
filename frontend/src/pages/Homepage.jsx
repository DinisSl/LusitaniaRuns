import RaceList from "../components/RaceList.jsx";

const Homepage = () => (
  <>
    <div className="text-center mt-8 space-y-2">
      <h1 className="font-bold text-5xl tracking-tight">
        <span className="bg-gradient-to-r from-green-700 via-yellow-500 to-red-600 bg-clip-text text-transparent">
          Lusitânia Runs
        </span>
      </h1>
      <p className="text-sm tracking-[0.3em] text-muted-foreground uppercase">
        Corre connosco
      </p>
    </div>
    <RaceList/>
  </>
);

export default Homepage;
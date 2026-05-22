import RaceList from "../components/RaceList.jsx";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        <h1 className="text-center font-bold text-4xl mt-4">Corridas em Portugal</h1>
        <RaceList/>
      </main>

    </div>
  );
}

export default Homepage;
import { useAuth } from "@/context/AuthContext";
import SignupList from "@/components/SignupList.jsx";

const MySignups = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="w-4/5 mx-auto px-4 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">As minhas inscrições</h2>
          {user.firstName && (
            <p className="text-muted-foreground mt-1">
              Olá, <span className="font-semibold text-foreground">{user.firstName}</span>! Aqui encontras todas as tuas inscrições em corridas.
            </p>
          )}
        </div>
        <hr className="border-border" />
        <SignupList/>
      </div>
    </>
  );
};

export default MySignups;

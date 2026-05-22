import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

const RUNNERSIGNUPS_URL = "http://localhost:8000/race/api/runnersignups/";

const RunnerSignup = () => {
  return (
    <div>
      <div className="p-10 flex items-start justify-center">
        <SignupForm
          signupUrl={RUNNERSIGNUPS_URL}
          title="Inscrição Corredor"
        />
      </div>
    </div>
  );
};

export default RunnerSignup;
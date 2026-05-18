import { useEffect } from "react";

function Register() {
  useEffect(() => {
    document.title = "Registracija";
  }, []);

  return <p className="text-5xl font-bold text-center">Register</p>
}

export default Register;
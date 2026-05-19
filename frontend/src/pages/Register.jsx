import { useEffect, useState } from "react";
import { registerUser } from "../services/userService";

function Register() {
  useEffect(() => {
    document.title = "Registracija";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const data = await registerUser(formData);

      setMessage(data.message);
      setIsError(false);

      setFormData({
        name: "",
        surname: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 border rounded-xl shadow-lg flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center">Registracija</h1>

        <input
          name="name"
          type="text"
          placeholder="Vardas"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          name="surname"
          type="text"
          placeholder="Pavardė"
          value={formData.surname}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="El.paštas"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Slaptažodis"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white py-3 rounded hover:opacity-90"
        >
          Registruotis
        </button>

        {message && (
          <p className={`text-center ${isError ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
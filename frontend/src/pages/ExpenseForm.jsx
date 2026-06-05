import { useEffect, useState } from "react";
import { createExpense } from "../services/expenseApi";
import { useNavigate } from "react-router"; 
import cekioLogo from "../assets/LogoIcon.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ? parseInt(payload.sub) : null; 
  } catch {
    return null;
  }
}

function ExpenseForm() {
  const navigate = useNavigate(); 

  useEffect(() => {
    document.title = "Nauja išlaida";
  }, []);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    expense_date: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setMessage("Kaina negali būti neigiama arba tuščia");
      setIsError(true);
      return;
    }

    const payload = {
      user_id: getUserId(),
      description: form.description,
      amount,
      expense_date: form.expense_date,
      category_id: form.category_id ? parseInt(form.category_id) : null,
    };

    setLoading(true);
    try {
      await createExpense(payload);
      setMessage("Įrašas išsaugotas");
      setIsError(false);
      setForm({ description: "", amount: "", expense_date: "", category_id: "" });
      
      navigate("/pagrindinis"); 
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      
      <div className="absolute inset-0" onClick={() => navigate("/pagrindinis")} />

      <main className="w-full max-w-[450px] bg-white rounded-lg border border-gray-100 shadow-xl p-8 md:p-12 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src={cekioLogo} alt="Čekiukai logo" className="w-10 h-10" />
            <h1 className="text-3xl font-semibold text-gray-900">Čekiukai</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Nauja išlaida</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Pavadinimas</label>
            <input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              placeholder="Pvz.: Maisto prekės"
              required
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Suma (€)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Išlaidos data</label>
            <input
              name="expense_date"
              type="date"
              value={form.expense_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Kategorija <span className="text-gray-400 font-normal">(nebūtinas)</span>
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all bg-white"
            >
              <option value="">-- Pasirinkite kategoriją --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-md font-semibold text-base hover:bg-[var(--color-primary-dark)] transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Saugoma..." : "Išsaugoti"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${isError ? "text-red-600" : "text-green-700"}`}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
}

export default ExpenseForm;
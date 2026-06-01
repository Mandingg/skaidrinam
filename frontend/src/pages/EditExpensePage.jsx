import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getExpense, updateExpense } from "../services/expenseApi";
import cekioLogo from "../assets/LogoIcon.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function EditExpensePage() {
  useEffect(() => {
    document.title = "Redaguoti išlaidą";
  }, []);

  const { id } = useParams();

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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    getExpense(id)
      .then((data) => {
        setForm({
          description: data.description || "",
          amount: data.amount || "",
          expense_date: data.expense_date || "",
          category_id: data.category_id || "",
        });
      })
      .catch((err) => {
        if (err.message === "Įrašas nerastas") setNotFound(true);
        else { setMessage(err.message); setIsError(true); }
      });
  }, [id]);

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
      description: form.description,
      amount,
      expense_date: form.expense_date,
      category_id: form.category_id ? parseInt(form.category_id) : null,
    };

    setLoading(true);
    try {
      await updateExpense(id, payload);
      setMessage("Įrašas atnaujintas");
      setIsError(false);
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  if (notFound) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <p className="text-red-600 font-medium">Įrašas nerastas</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-[450px] bg-white rounded-lg border border-gray-100 shadow-sm p-8 md:p-12">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src={cekioLogo} alt="Čekiukai logo" className="w-10 h-10" />
            <h1 className="text-3xl font-semibold text-gray-900">Čekiukai</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Redaguoti išlaidą</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Pavadinimas</label>
            <input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all"
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
              required
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all"
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
            className="w-full bg-[#437d38] text-white py-3 rounded-md font-semibold text-base hover:bg-[#386a2f] transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Saugoma..." : "Išsaugoti pakeitimus"}
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

export default EditExpensePage;

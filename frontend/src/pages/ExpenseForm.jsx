import { useEffect, useState } from "react";
import { createExpense } from "../services/expenseApi";
import cekioLogo from "../assets/LogoIcon.svg";

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.user_id || payload.id || null;
  } catch {
    return null;
  }
}

function ExpenseForm() {
  useEffect(() => {
    document.title = "Nauja išlaida";
  }, []);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    expense_date: "",
    category_id: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-[450px] bg-white rounded-lg border border-gray-100 shadow-sm p-8 md:p-12">
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
              Kategorija ID <span className="text-gray-400 font-normal">(nebūtinas)</span>
            </label>
            <input
              name="category_id"
              type="number"
              value={form.category_id}
              onChange={handleChange}
              placeholder="Palikite tuščią"
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#437d38] text-white py-3 rounded-md font-semibold text-base hover:bg-[#386a2f] transition-colors duration-200 disabled:opacity-50"
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

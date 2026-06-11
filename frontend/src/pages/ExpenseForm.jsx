import { useEffect, useState } from "react";
import { createExpense, getUserStores } from "../services/expenseApi";
import { createIncome } from "../services/incomeApi";
import { useNavigate } from "react-router";
import { getUserCategories } from "../services/expenseService";
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
    category_name: "", 
    source: "",
    store_name: "",
  });
  
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewStore, setIsNewStore] = useState(false);

  const INCOME_SOURCES = [
    "Darbo užmokestis",
    "Stipendija",
    "Investicijos",
    "Dovana",
    "Kita",
  ];

  useEffect(() => {
    const loadStores = async () => {
      const data = await getUserStores();
      const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setStores(sortedData);
    };
    loadStores();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getUserCategories();
      const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedData);
    };
    loadCategories();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCategoryChange(e) {
    const value = e.target.value;
    if (value === "new") {
      setIsNewCategory(true);
      setForm({ ...form, category_name: "" }); 
    } else {
      setIsNewCategory(false);
      setForm({ ...form, category_name: value });
    }
  }

  function handleStoreChange(e) {
    const value = e.target.value;
    if (value === "new") {
      setIsNewStore(true);
      setForm({ ...form, store_name: "" }); 
    } else {
      setIsNewStore(false);
      setForm({ ...form, store_name: value });
    }
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

    setLoading(true);
    try {
      if (transactionType === "expense") {
        await createExpense({
          expense: {
            user_id: getUserId(),
            description: form.description,
            amount: amount,
            expense_date: form.expense_date,
            category_name: form.category_name || null, // Sent purely as a string name
          },
          store: {
            name: form.store_name,
          },
        });
      } else {
        await createIncome({
          user_id: getUserId(),
          source: form.source,
          description: form.description,
          amount,
          income_date: form.expense_date,
        });
      }
      setMessage("Įrašas išsaugotas");
      setIsError(false);
      setIsNewCategory(false);
      setIsNewStore(false);
      setForm({
        description: "",
        amount: "",
        expense_date: "",
        category_name: "",
        source: "",
        store_name: "",
      });

      navigate("/pagrindinis");
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
    

    <div
      className="absolute inset-0"
      onClick={() => navigate("/pagrindinis")}
    />

    <main className="w-full max-w-[450px] bg-white rounded-lg border border-gray-100 shadow-sm p-8 md:p-12 relative z-10 my-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src={cekioLogo} alt="Čekiukai logo" className="w-10 h-10" />
            <h1 className="text-3xl font-semibold text-gray-900">Čekiukai</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {transactionType === "expense" ? "Nauja išlaida" : "Naujos pajamos"}
          </h2>
        </div>

        <div className="flex w-full mb-4 rounded-lg overflow-hidden border border-gray-200">
          <button
            type="button"
            aria-label="Pasirinkti įrašo kategoriją"
            onClick={() => setTransactionType("expense")}
            className={`flex-1 py-3 font-medium transition-colors ${
              transactionType === "expense"
                ? "bg-[var(--color-error)] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Išlaida
          </button>

          <button
            type="button"
            aria-label="Pasirinkti įrašo kategoriją"
            onClick={() => setTransactionType("income")}
            className={`flex-1 py-3 font-medium transition-colors ${
              transactionType === "income"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Pajamos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Pavadinimas
            </label>
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

          {transactionType === "income" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Pajamų šaltinis
              </label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-sm"
              >
                <option value="">-- Pasirinkite pajamų šaltinį --</option>

                {INCOME_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          )}

          {transactionType === "expense" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Parduotuvė
              </label>

              <select
                name="store_name"
                value={isNewStore? "new" : form.store_name}
                onChange={handleStoreChange}
                required
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-sm"
              >
                <option value="">-- Pasirinkite parduotuvę --</option>

                {stores.map((store) => (
                  <option key={store.id} value={store.name}>
                    {store.name}
                  </option>
                ))}
                <option value="new" className="italic">
                  Įvesti naują...
                </option>
              </select>
            
            {isNewStore && (
                <input
                  name="store_name"
                  type="text"
                  value={form.store_name}
                  onChange={handleChange}
                  placeholder="Įveskite naujos parduotuvės pavadinimą"
                  required
                  className="mt-2 w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all"
                />
              )}
              </div>

          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Suma (€)
            </label>
            <input
              name="amount"
              type="text"
              inputMode="decimal"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              {transactionType === "expense" ? "Išlaidos data" : "Pajamų data"}
            </label>
            <input
              name="expense_date"
              type="date"
              value={form.expense_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all"
            />
          </div>

          {transactionType === "expense" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Kategorija{" "}
                <span className="text-gray-400 font-normal">(nebūtina)</span>
              </label>
              <select
                name="category_selection"
                value={isNewCategory ? "new" : form.category_name}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all bg-white"
              >
                <option value="">-- Pasirinkite kategoriją --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="new" className="italic">
                  Įvesti naują...
                </option>
              </select>

              {isNewCategory && (
                <input
                  name="category_name"
                  type="text"
                  value={form.category_name}
                  onChange={handleChange}
                  placeholder="Įveskite naujos kategorijos pavadinimą"
                  required
                  className="mt-2 w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] text-sm transition-all"
                />
              )}
            </div>
          )}

          <button
            type="submit"
            aria-label="Išsaugoti įrašą"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-md font-semibold text-base hover:bg-[var(--color-primary-dark)] transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Saugoma..." : "Išsaugoti"}
          </button>

          <button
            className="w-full bg-[var(--color-error)] text-white py-3 rounded-md font-semibold text-base hover:bg-[var(--color-error-dark)] transition-colors duration-200 disabled:opacity-50"
            onClick={() => navigate("/pagrindinis")}
          >
            Atšaukti
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${isError ? "text-red-600" : "text-green-700"}`}
          >
            {message}
          </p>
        )}
      </main>
    </div>
  );
}

export default ExpenseForm;
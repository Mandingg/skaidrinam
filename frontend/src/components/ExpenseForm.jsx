import { useState } from "react";
import { createExpense } from "../services/expenseApi";

export default function ExpenseForm() {
  const [form, setForm] = useState({
    user_id: "",
    description: "",
    amount: "",
    expense_date: "",
    category_id: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setError("Kaina negali būti neigiama arba tuščia");
      return;
    }

    const payload = {
      user_id: parseInt(form.user_id),
      description: form.description,
      amount,
      expense_date: form.expense_date,
      category_id: form.category_id ? parseInt(form.category_id) : null,
    };

    setLoading(true);
    try {
      await createExpense(payload);
      setMessage("Įrašas išsaugotas");
      setForm({
        user_id: form.user_id,
        description: "",
        amount: "",
        expense_date: "",
        category_id: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Pridėti išlaidą</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vartotojo ID:</label>
          <input
            name="user_id"
            type="number"
            value={form.user_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pavadinimas:</label>
          <input
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Suma (€):</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Išlaidos data:</label>
          <input
            name="expense_date"
            type="date"
            value={form.expense_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Kategorija ID (nebūtinas):</label>
          <input
            name="category_id"
            type="number"
            value={form.category_id}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saugoma..." : "Išsaugoti"}
        </button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

import { useState, useEffect } from "react";
// import Navigation from "../components/Navigation";
import SearchBar from "../components/SearchBar";
import {
  getUserCategories,
  getUserExpenses,
  deleteExpense,
} from "../services/expenseService";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_DESC");
  const [categories, setCategories] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
    const loadExpenses = async () => {
      const data = await getUserExpenses();
      setExpenses(data);
    };
    loadExpenses();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getUserCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);
  
  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      if (!expense) return false;

      const titleText = expense.title || expense.description || "";
      const shopText = expense.shop_name || "";

      const matchesSearch =
        titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shopText.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" ||
        String(expense.category_name || "").toLowerCase() ===
          String(selectedCategory).toLowerCase();

      const given_date = new Date(selectedDate);
      const expense_date = new Date(expense.expense_date);
      const matchesDate =
        !selectedDate ||
        expense_date.toDateString() === given_date.toDateString();

      return matchesSearch && matchesCategory && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === "DATE_DESC") {
        return new Date(b.expense_date) - new Date(a.expense_date);
      }
      if (sortBy === "DATE_ASC") {
        return new Date(a.expense_date) - new Date(b.expense_date);
      }
      if (sortBy === "PRICE_DESC") {
        return parseFloat(b.amount) - parseFloat(a.amount);
      }
      if (sortBy === "PRICE_ASC") {
        return parseFloat(a.amount) - parseFloat(b.amount);
      }
      return 0;
    });

  const handleDelete = async (expenseId) => {
    const result = await deleteExpense(expenseId);
    console.log("Ištrynimo rezultatas:", result);
    if (result) {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((item) => item.id !== expenseId),
      );
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      alert("Nepavyko ištrinti įrašo.");
    }
  };

  return (
    <div
      className="min-h-screen text-[14px]"
      style={{
        backgroundColor: "var(--color-background)",
        fontFamily: "var(--font-family)",
      }}
    >
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* <Navigation /> */}
        <main
          className="flex-1 ml-64 w-full"
          style={{
            padding: "var(--space-5)",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <section style={{ marginBottom: "var(--space-5)" }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h1
                  className="font-bold mb-1"
                  style={{
                    color: "var(--color-neutral)",
                    fontSize: "var(--text-display)",
                  }}
                >
                  Mano išlaidos
                </h1>
                <p
                  style={{
                    color: "var(--color-neutral)",
                    opacity: 0.7,
                    fontSize: "var(--text-body)",
                  }}
                >
                  Peržiūrėkite visas užregistruotas išlaidas.
                </p>
              </div>
            </div>

            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </section>

          <div
            className="border overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-md)",
              borderColor: "var(--color-secondary)",
            }}
          >
            <div
              className="border-b flex justify-between items-center"
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderColor: "var(--color-secondary)",
              }}
            >
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:opacity-8 transition-opacity font-medium"
                style={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                Eksportuoti CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ backgroundColor: "var(--color-navigation)" }}>
                    <th
                      className="font-semibold"
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--color-primary-dark)",
                      }}
                    >
                      Pavadinimas
                    </th>
                    <th
                      className="font-semibold"
                      style={{
                        padding: "var(--space-3) var(--space-3)",
                        color: "var(--color-primary-dark)",
                      }}
                    >
                      Parduotuvė
                    </th>
                    <th
                      className="font-semibold"
                      style={{
                        padding: "var(--space-3) var(--space-3)",
                        color: "var(--color-primary-dark)",
                      }}
                    >
                      Data
                    </th>
                    <th
                      className="font-semibold"
                      style={{
                        padding: "var(--space-3) var(--space-3)",
                        color: "var(--color-primary-dark)",
                      }}
                    >
                      Kategorija
                    </th>
                    <th
                      className="font-semibold text-right"
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--color-primary-dark)",
                      }}
                    >
                      Suma
                    </th>
                    <th
                      className="font-semibold text-right text-gray-500"
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                      }}
                    >
                      Ištrinti įrašą:
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ borderColor: "var(--color-secondary)" }}
                >
                  {filteredAndSortedExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                        <div className="flex items-center gap-3">
                          <div>
                            <div
                              className="font-semibold"
                              style={{ color: "var(--color-neutral)" }}
                            >
                              {expense.title || expense.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "var(--space-3) var(--space-3)",
                          color: "var(--color-neutral)",
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {expense.shop_name || "Nenurodyta"}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "var(--space-3) var(--space-3)",
                          color: "var(--color-neutral)",
                          opacity: 0.8,
                        }}
                      >
                        {expense.expense_date}
                      </td>
                      <td style={{ padding: "var(--space-3) var(--space-3)" }}>
                        {expense.category_name || "Nenurodyta"}
                      </td>
                      <td
                        className="text-right font-bold"
                        style={{
                          padding: "var(--space-3) var(--space-4)",
                          color: "var(--color-neutral)",
                          fontSize: "var(--text-body)",
                        }}
                      >
                        {Number(expense.amount).toFixed(2)} €
                      </td>
                      <td
                        className="text-center"
                        style={{
                          padding: "var(--space-3) var(--space-4)",
                          color: "var(--color-neutral)",
                          fontSize: "var(--text-body)",
                        }}
                      >
                        <button
                          onClick={() => {
                            console.log("Mygtukas paspaustas. Bandome ištrinti ID:", expense.id);
                            handleDelete(expense.id);
                          }}
                          className="cursor-pointer text-gray-400 hover:text-red-600 font-bold text-lg transition-colors px-2 py-1 rounded-xl hover:bg-red-50"
                          title="Ištrinti šį įrašą"
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredAndSortedExpenses.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8"
                        style={{ color: "var(--color-neutral)", opacity: 0.5 }}
                      >
                        Nėra išlaidų, atitinkančių parinktus filtrus.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="border-t flex items-center justify-between"
              style={{
                padding: "var(--space-3) var(--space-4)",
                backgroundColor: "var(--color-navigation)",
                borderColor: "var(--color-secondary)",
              }}
            >
              <span style={{ color: "var(--color-neutral)", opacity: 0.7 }}>
                Rodoma 1-{filteredAndSortedExpenses.length} iš{" "}
                {filteredAndSortedExpenses.length} įrašų
              </span>
              <div className="flex gap-1">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white opacity-50 cursor-not-allowed">
                  {"<"}
                </button>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg border font-bold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "#ffffff",
                    borderColor: "var(--color-primary)",
                  }}
                >
                  1
                </button>

                <button className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white opacity-50 cursor-not-allowed">
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showMessage && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-white font-medium animate-bounce"
          style={{
            backgroundColor: "var(--color-primary-dark)",
            borderColor: "var(--color-primary)",
            zIndex: 9999,
          }}
        >
          <span className="text-lg">✓</span>
          <span>Įrašas ištrintas sėkmingai!</span>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;

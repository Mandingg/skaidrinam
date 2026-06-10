import { useState, useEffect } from "react";
import { Link } from "react-router";
import SearchBar from "../components/SearchBar";
import {
  getUserCategories,
  getUserExpenses,
  deleteExpense,
  exportExpensesCSV,
} from "../services/expenseService";
import { getUser } from "../services/userService";
import EditIcon from "../assets/EditIcon.svg";
import DeleteIcon from "../assets/DeleteIcon.svg";
import Warning from "../assets/Warning.svg";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_DESC");
  const [categories, setCategories] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [exportMessage, setExportMessage] = useState(false);
  const [user, setUser] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [exportAvailable, setExportAvailable] = useState(false);

  useEffect(() => {
    document.title = "Mano išlaidos";
  }, []);

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await getUserExpenses();
      setExpenses(data);
      if (data.length > 0) {
        setExportAvailable(true);
      }
    };
    loadExpenses();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getUserCategories();
      const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedData);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUser();
      setUser(data);
    };
    loadUser();
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

  const triggerDeleteConfirmation = (id) => {
    setItemToDelete(id);
  };

  const handleDelete = async (expenseId) => {
    const result = await deleteExpense(expenseId);
    console.log("Ištrynimo rezultatas:", result);
    if (result) {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((item) => item.id !== expenseId),
      );
      setShowMessage(true);
      setItemToDelete(null);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      alert("Nepavyko ištrinti įrašo.");
    }
  };

  const handleExport = async () => {
    if (user?.subscription_type !== "PREMIUM") {
      setShowPremiumModal(true);
      return;
    }
    if (exportAvailable) {
      setExportMessage(true);
      try {
        await exportExpensesCSV();
      } catch (error) {
        alert("Nepakvyko eskportuoti CSV failo. Pamėginkite vėliau.");
        console.warn("Klaida ekxportuojant duomenis;", error.message);
      } finally {
        setExportMessage(false);
      }
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
        <main
          className="flex-1 w-full mx-auto p-4 pt-16 md:pt-[var(--space-5)] md:p-[var(--space-5)] md:ml-[var(--sidebar-width)]"
          style={{
            maxWidth: "1200px",
          }}
        >
          <section style={{ marginBottom: "var(--space-5)" }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h1
                  className="font-bold mb-1"
                  style={{
                    color: "var(--color-primary)",
                    fontSize: "40px",
                    fontWeight: "var(--font-weight-bold)",
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
              backgroundColor: "var(--color-background)",
              borderRadius: "var(--radius-md)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="border-b flex column"
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderColor: "var(--border-color)",
              }}
            >
              <button
                onClick={handleExport}
                disabled={!exportAvailable || exportMessage}
                className="group relative px-3 py-1.5 rounded-lg border hover:opacity-80 transition-opacity cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
                style={{
                  borderColor: "var(--color-primary)",
                  backgroundColor:
                    user?.subscription_type === "PREMIUM"
                      ? "var(--color-primary)"
                      : "var(--color-navigation)",
                  color:
                    user?.subscription_type === "PREMIUM"
                      ? "#ffffff"
                      : "var(--color-primary)",
                }}
              >
                {!exportMessage ? (
                  user?.subscription_type === "PREMIUM" ? (
                    <>
                      <span
                        className={!exportAvailable ? "group-hover:hidden" : ""}
                      >
                        Eksportuoti viską į CSV
                      </span>

                      {!exportAvailable && (
                        <span className="hidden group-hover:inline">
                          Išlaidų sąrašas tuščias
                        </span>
                      )}
                    </>
                  ) : (
                    "Eksportas tik PREMIUM"
                  )
                ) : (
                  "Ekspotuojama"
                )}
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
                      Redaguoti
                    </th>
                    <th
                      className="font-semibold text-right text-gray-500"
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                      }}
                    >
                      Ištrinti
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
                        className="text-right"
                        style={{
                          padding: "var(--space-3) var(--space-4)",
                          color: "var(--color-neutral)",
                          fontSize: "var(--text-body)",
                        }}
                      >
                        <Link
                          to={`redaguoti/${expense.id}`}
                          className="inline-flex items-center justify-center gap-2 px-2 py-1 no-underline cursor-pointer"
                        >
                          <img src={EditIcon} alt="edit" className="w-5 h-5" />
                        </Link>
                      </td>
                      <td
                        className="text-right"
                        style={{
                          padding: "var(--space-3) var(--space-4)",
                          color: "var(--color-neutral)",
                          fontSize: "var(--text-body)",
                        }}
                      >
                        <button
                          onClick={() => {
                            console.log(
                              "Mygtukas paspaustas. Bandome ištrinti ID:",
                              expense.id,
                            );
                            triggerDeleteConfirmation(expense.id);
                          }}
                          className="cursor-pointer text-gray-400 font-bold text-lg transition-colors px-2 py-1 "
                          title="Ištrinti šį įrašą"
                        >
                          <img
                            src={DeleteIcon}
                            alt="delete"
                            className="w-5 h-5"
                          />
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

      {itemToDelete !== null && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000]">
          <div className="w-full max-w-[420px] bg-white rounded-[var(--radius-md)] p-[var(--space-5)] text-center shadow-[var(--shadow-md)]">
            <img
              src={Warning}
              alt="PERSPĖJIMAS"
              className="w-[60px] h-[60px] block p-[10px] mx-auto mb-[var(--space-3)] bg-[var(--color-error-light)] rounded-full"
            />

            <h3 className="mb-[var(--space-3)] text-[var(--color-neutral)] text-[var(--text-h2)] font-[var(--font-weight-bold)]">
              Ar tikrai norite ištrinti įrašą?
            </h3>

            <div className="flex flex-col gap-[var(--space-2)] items-center">
              <button
                type="button"
                className="w-full max-w-[240px] h-[48px] rounded-[var(--radius-sm)] font-[var(--font-weight-medium)] cursor-pointer border border-solid border-[var(--border-color)] bg-transparent"
                onClick={() => setItemToDelete(null)}
              >
                Atšaukti
              </button>

              <button
                type="button"
                className="w-full max-w-[240px] h-[48px] bg-[var(--color-error)] text-white font-[var(--font-weight-bold)] cursor-pointer rounded-[var(--radius-sm)] border-none"
                onClick={() => handleDelete(itemToDelete)}
              >
                Ištrinti įrašą
              </button>
            </div>
          </div>
        </div>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000]">
          <div className="w-full max-w-[420px] bg-white rounded-[var(--radius-md)] p-[var(--space-5)] text-center shadow-[var(--shadow-md)]">
            <img
              src={Warning}
              alt="PERSPĖJIMAS"
              className="w-[60px] h-[60px] block p-[10px] mx-auto mb-[var(--space-3)] bg-[var(--color-error-light)] rounded-full"
            />

            <h3 className="mb-[var(--space-3)] text-[var(--color-neutral)] text-[var(--text-h2)] font-[var(--font-weight-bold)]">
              Funkcija prieinama tik PREMIUM vartotojams
            </h3>

            <p className="mb-[var(--space-4)] text-[var(--color-neutral)] leading-6">
              Norėdami eksportuoti išlaidų duomenis į CSV, atnaujinkite
              prenumeratos planą profilio puslapyje.
            </p>

            <div className="flex flex-col gap-[var(--space-2)] items-center">
              <button
                type="button"
                className="w-full max-w-[240px] h-[48px] rounded-[var(--radius-sm)] font-[var(--font-weight-medium)] cursor-pointer border border-solid border-[var(--border-color)] bg-transparent"
                onClick={() => setShowPremiumModal(false)}
              >
                Uždaryti
              </button>

              <Link
                to="/profilis"
                className="w-full max-w-[240px] h-[48px] flex items-center justify-center bg-[var(--color-primary)] text-white font-[var(--font-weight-bold)] cursor-pointer rounded-[var(--radius-sm)] no-underline"
              >
                Eiti į profilį
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;

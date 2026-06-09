import { useEffect, useState } from "react";
import './MainPage.css';
import EditPen from "../../assets/EditPen.svg";
import AddNote from "../../assets/AddNote.svg";
import Warning from "../../assets/Warning.svg";
import { Link, useNavigate, Outlet, useLocation } from "react-router";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ? parseInt(payload.sub) : null;
  } catch {
    return null;
  }
}

function MainPage() {
  const [user, setUser] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [allIncome, setAllIncome] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("current_month");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Pradžia - Čekiukai";

    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken();

        if (!token || !userId) {
          throw new Error("Sesija pasibaigė. Prisijunkite iš naujo.");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const userRes = await fetch("http://127.0.0.1:8000/users/me", {
          method: "GET",
          headers,
        });

        const userData = await userRes.json();

        if (!userRes.ok) {
          throw new Error(userData.detail || "Nepavyko gauti vartotojo duomenų");
        }

        setUser(userData);

        const expensesRes = await fetch(
          `http://127.0.0.1:8000/expenses/list?user_id=${userId}`,
          { method: "GET", headers }
        );

        if (expensesRes.ok) {
          const expensesData = await expensesRes.json();
          setAllExpenses(Array.isArray(expensesData) ? expensesData : []);
        } else {
          setAllExpenses([]);
        }

        const incomeRes = await fetch(
          `http://127.0.0.1:8000/incomes/list?user_id=${userId}`,
          { method: "GET", headers }
        );

        if (incomeRes.ok) {
          const incomeData = await incomeRes.json();
          setAllIncome(Array.isArray(incomeData) ? incomeData : []);
        } else {
          setAllIncome([]);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, [location.pathname]);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const currentDateStr = new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "long",
  }).format(now);

  const filteredTransactions = allExpenses.filter((tx) => {
    if (!tx.expense_date) return false;

    const txDate = new Date(tx.expense_date);
    const txDateStart = new Date(
      txDate.getFullYear(),
      txDate.getMonth(),
      txDate.getDate()
    );

    if (filter === "current_month") {
      return (
        txDateStart.getMonth() === now.getMonth() &&
        txDateStart.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "last_30_days") {
      const thirtyDaysAgo = new Date(todayStart.getTime());
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return txDateStart >= thirtyDaysAgo && txDateStart <= todayStart;
    }

    if (filter === "current_year") {
      return txDateStart.getFullYear() === now.getFullYear();
    }

    return true;
  });

  const filteredIncome = allIncome.filter((income) => {
    if (!income.income_date) return false;

    const incomeDate = new Date(income.income_date);
    const incomeDateStart = new Date(
      incomeDate.getFullYear(),
      incomeDate.getMonth(),
      incomeDate.getDate()
    );

    if (filter === "current_month") {
      return (
        incomeDateStart.getMonth() === now.getMonth() &&
        incomeDateStart.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "last_30_days") {
      const thirtyDaysAgo = new Date(todayStart.getTime());
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return incomeDateStart >= thirtyDaysAgo && incomeDateStart <= todayStart;
    }

    if (filter === "current_year") {
      return incomeDateStart.getFullYear() === now.getFullYear();
    }

    return true;
  });

  const transactions = [
    ...allExpenses.map((tx) => ({
      id: `exp-${tx.id}`,
      type: "expense",
      title: tx.description || "Išlaida be pavadinimo",
      category: tx.category_name || "Bendra / Kita",
      amount: Number(tx.amount) || 0,
      date: tx.expense_date,
      createdAt: tx.created_at,
    })),
    ...allIncome.map((inc) => ({
      id: `inc-${inc.id}`,
      type: "income",
      title: inc.description || "Pajamos be pavadinimo",
      category: inc.category_name || "Pajamos",
      amount: Number(inc.amount) || 0,
      date: inc.income_date,
      createdAt: inc.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const incomeSum = filteredIncome.reduce(
    (sum, income) => sum + (parseFloat(income.amount) || 0),
    0
  );

  const expensesSum = filteredTransactions.reduce(
    (sum, tx) => sum + (parseFloat(tx.amount) || 0),
    0
  );

  const balance = incomeSum - expensesSum;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Intl.DateTimeFormat("lt-LT", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  if (error) {
    return (
      <div
        className="main-content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <p
          style={{
            color: "var(--color-error)",
            fontSize: "var(--text-h2)",
            fontWeight: "var(--font-weight-bold)",
          }}
        >
          Klaida: {error}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="main-content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <p style={{ color: "var(--color-neutral)", fontSize: "var(--text-h2)" }}>
          Kraunama...
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="page-header">
          <h2>Sveiki, {user.name} {user.surname}!</h2>

          <div className="date-filter">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="current_month">{currentDateStr}</option>
              <option value="last_30_days">Paskutinės 30 dienų</option>
              <option value="current_year">Einamieji metai</option>
            </select>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card income">
            <p>Pajamos ({filter === "current_month" ? "šį mėnesį" : "periodo"})</p>
            <h3>{formatCurrency(incomeSum)}</h3>
          </div>

          <div className="stat-card expense">
            <p>Išlaidos ({filter === "current_month" ? "šį mėnesį" : "periodo"})</p>
            <h3 style={{ color: "#ef4444" }}>{formatCurrency(expensesSum)}</h3>
          </div>

          <div className={`stat-card average ${balance < 0 ? "negative" : "positive"}`}>
            <p>Likutis</p>
            <h3 style={{ color: balance < 0 ? "#ef4444" : "#437d38" }}>
              {formatCurrency(balance)}
            </h3>
            <span style={{ fontSize: "0.85rem", color: "gray" }}>
              ({formatCurrency(incomeSum)} - {formatCurrency(expensesSum)})
            </span>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <h4>Įveskite naują transakciją</h4>
            <p className="panel-subtitle">Greitai įveskite išlaidas arba pajamas</p>

            <div className="action-grid">
              <div
                className="action-card"
                onClick={() => navigate("/pagrindinis/naujas")}
              >
                <div className="icon-wrapper">
                  <img src={EditPen} alt="Rankinis įvedimas" className="action-icon" />
                </div>
                <h5>Rankinis įvedimas</h5>
                <p>Įveskite išlaidą rankiniu būdu</p>
              </div>

              <div
                className={`action-card upload ${user?.subscription_type !== "PREMIUM" ? "disabled" : ""
                  }`}
                onClick={() => {
                  if (user?.subscription_type === "PREMIUM") {
                    navigate("/kvito-nuskaitymas");
                  } else {
                    setShowPremiumModal(true);
                  }
                }}
              >
                <div className="icon-wrapper">
                  <img src={AddNote} alt="Dokumentas" className="action-icon" />
                </div>

                <h5>Pridėti čekį / dokumentą</h5>

                <p>
                  {user?.subscription_type === "PREMIUM"
                    ? "Prisekite JPG, PDF arba PNG failą"
                    : "Prieinama tik Premium vartotojams"}
                </p>
              </div>
            </div>
          </div>

          <div className="panel transactions-panel">
            <h4>Paskutiniai įrašai</h4>

            {transactions.length === 0 ? (
              <p className="panel-subtitle" style={{ marginTop: "var(--space-3)" }}>
                Nėra išlaidų šiuo periodu.
              </p>
            ) : (
              <div className="transactions-list">
                {transactions.map((tx) => (
                  <div className="transaction" key={tx.id}>
                    <div>
                      <p className="transaction-title">{tx.title}</p>
                      <p className="transaction-category">{tx.category}</p>
                    </div>

                    <div className="transaction-right">
                      <p
                        className="transaction-amount"
                        style={{
                          color: tx.type === "income" ? "#437d38" : "#ef4444",
                          fontWeight: "600",
                        }}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="transaction-date">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Outlet />

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
              Norėdami naudotis AI kvitų nuskaitymu, atnaujinkite prenumeratos planą profilio puslapyje.
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

export default MainPage;
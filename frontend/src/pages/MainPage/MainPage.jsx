import { useEffect, useState } from "react";
import './MainPage.css';
import EditPen from "../../assets/EditPen.svg";
import AddNote from "../../assets/AddNote.svg";
import { useNavigate } from "react-router";

function MainPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("current_month"); 
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Pradžia";

    async function fetchUser() {
      try {
        const token = localStorage.getItem("token"); 

        if (!token) {
          throw new Error("Žetonas nerastas. Prisijunkite iš naujo.");
        }

        const response = await fetch(`http://127.0.0.1:8001/me?period=${filter}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Nepavyko gauti vartotojo duomenų");
        }

        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchUser();
  }, [filter]);

  const now = new Date();
  const currentDate = new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "long",
  }).format(now);

  if (error) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }}>
          Klaida: {error}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-h2)' }}>
          Kraunama...
        </p>
      </div>
    );
  }

  const expenses = user.total_expenses || 0; 
  const temporaryIncome = expenses; 
  const balance = temporaryIncome - expenses;

  const transactions = user.recent_transactions || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("lt-LT", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="page-header">
          <h2>Sveiki, {user.name} {user.surname}!</h2>

          <div className="date-filter">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="current_month">{currentDate}</option>
              <option value="last_30_days">Paskutinės 30 dienų</option>
              <option value="current_year">Einamieji metai</option>
            </select>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card income">
            <p>Pajamos (Laikinai išlaidos)</p>
            <h3>{formatCurrency(temporaryIncome)}</h3>
          </div>

          <div className="stat-card expense">
            <p>Išlaidos</p>
            <h3>{formatCurrency(expenses)}</h3>
          </div>

          <div className="stat-card average">
            <p>Mokėjimų balansas</p>
            <h3>{formatCurrency(balance)}</h3>
            <span>
              ({formatCurrency(temporaryIncome)} - {formatCurrency(expenses)})
            </span>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <h4>Įveskite naują transakciją</h4>
            <p className="panel-subtitle">Greitai įveskite išlaidas arba pajamas</p>

            <div className="action-grid">
              <div className="action-card" onClick={() => navigate("/prideti/rankinis")}>
                <div className="icon-wrapper">
                  <img src={EditPen} alt="Rankinis įvedimas" className="action-icon"/>
                </div>
                <h5>Rankinis įvedimas</h5>
                <p>Įveskite transakciją rankiniu būdu</p>
              </div>

              <div className="action-card upload" onClick={() => navigate("/prideti/automatinis")}>
                <div className="icon-wrapper">
                  <img src={AddNote} alt="Dokumentas" className="action-icon" />
                </div>
                <h5>Pridėti čekį / dokumentą</h5>
                <p>Prisekite JPG, PDF arba PNG failą</p>
              </div>
            </div>
          </div>

          {/* TRANSKACIJŲ PANELĖ SU CIKLU */}
          <div className="panel transactions-panel">
            <h4>Paskutinės transakcijos</h4>

            {transactions.length === 0 ? (
              <p className="panel-subtitle" style={{ marginTop: 'var(--space-3)' }}>Nėra atliktų transakcijų.</p>
            ) : (
              transactions.map((tx) => (
                <div className="transaction" key={tx.id}>
                  <div>
                    <p className="transaction-title">
                      {tx.description || "Išlaida be pavadinimo"}
                    </p>
                    <p className="transaction-category">
                      {tx.category_name || "Bendra"}
                    </p>
                  </div>

                  <div className="transaction-right">
                    {/* Išlaidos visada su minuso ženklu */}
                    <p className="transaction-amount">
                      -{formatCurrency(tx.amount)}
                    </p>
                    <p className="transaction-date">
                      {formatDate(tx.expense_date)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainPage;
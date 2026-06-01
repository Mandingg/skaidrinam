import { useEffect } from "react";
import './MainPage.css';
import EditPen from "../../assets/EditPen.svg";
import AddNote from "../../assets/AddNote.svg";

function MainPage() {
    useEffect(() => {
    document.title = "Pradžia";
  }, []);

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="page-header">
          <h2>Pradžia</h2>

          <button className="date-btn">
            2024 m. gegužė
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card income">
            <p>Pajamos</p>
            <h3>€1,950.00</h3>
          </div>

          <div className="stat-card expense">
            <p>Išlaidos</p>
            <h3>€1,674.60</h3>
          </div>

          <div className="stat-card average">
            <p>Bendras mėnesio vidurkis</p>
            <h3>€275.40</h3>
            <span>
              (Pajamos €1,950.00 - Išlaidos €1,674.60)
            </span>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <h4>Įveskite naują transakciją</h4>
            <p className="panel-subtitle">
              Greitai įveskite išlaidas arba pajamas
            </p>

            <div className="action-grid">
              <div className="action-card">
                <div className="icon-wrapper">
                  <img src={EditPen} alt="Rankinis įvedimas" className="action-icon"/>
                </div>

                <h5>Rankinis įvedimas</h5>

                <p>
                  Įveskite transakciją rankiniu būdu
                </p>
              </div>

              <div className="action-card upload">
                <div className="icon-wrapper">
                  <img src={AddNote} alt="Dokumentas" className="action-icon" />
                </div>

                <h5>Pridėti čekį / dokumentą</h5>

                <p>
                  Prisekite JPG, PDF arba PNG failą
                </p>
              </div>
            </div>
          </div>

          <div className="panel transactions-panel">
            <h4>Paskutinės transakcijos</h4>

            <div className="transaction">
              <div>
                <p className="transaction-title">
                  Maxima XX
                </p>
                <p className="transaction-category">
                  Maistas
                </p>
              </div>

              <div className="transaction-right">
                <p className="transaction-amount">
                  -€45.32
                </p>
                <p className="transaction-date">
                  Geg 26, 2024
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainPage;
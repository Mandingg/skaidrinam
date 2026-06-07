import { useState, useEffect } from "react";
import PivotTable from "react-pivottable/PivotTable";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";

import { getUserTransactions } from "../../services/analyticsService";
import "./Analytics.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [chartType, setChartType] = useState("Table");
  const [rowAxis, setRowAxis] = useState("Mėnuo");
  const [colAxis, setColAxis] = useState("Transakcijos tipas");
  const [calcValue, setCalcValue] = useState("Suma");
  const [aggregator, setAggregator] = useState("Sum");

  const availableFields = [
    { id: "Mėnuo", label: "Mėnuo" },
    { id: "Transakcijos tipas", label: "Transakcijos tipas" },
    { id: "Išlaidų kategorija", label: "Išlaidų kategorija" },
    { id: "Parduotuvė", label: "Parduotuvė" },
    { id: "Pajamų šaltinis", label: "Pajamų šaltinis" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const transactions = await getUserTransactions();
        const adjustedData = transactions.map((item) => ({
          "Transakcijos tipas": item["Transakcijos tipas"],
          "Išlaidų kategorija": item["Išlaidų kategorija"] || "Nenurodyta",
          Parduotuvė: item["Parduotuvė"] || "Nenurodyta",
          "Pajamų šaltinis": item["Pajamų šaltinis"] || "Nenurodyta",
          Mėnuo: item["Mėnuo"],
          Suma: parseFloat(item["Suma"])
        }));
        setData(adjustedData);
      } catch (error) {
        console.error("Klaida užkraunant analitikos duomenis:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const renderChartSection = () => {
    if (data.length === 0) return null;

    const horizontalLabels = [
      ...new Set(data.map((item) => item[rowAxis])),
    ].sort();
    const structuralSeries = [
      ...new Set(data.map((item) => item[colAxis])),
    ].sort();

    const backgroundColors = [
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 99, 132, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(241, 196, 15, 0.7)",
      "rgba(155, 89, 182, 0.7)",
      "rgba(230, 126, 34, 0.7)",
    ];
    const borderColors = [
      "rgba(54, 162, 235, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(241, 196, 15, 1)",
      "rgba(155, 89, 182, 1)",
      "rgba(230, 126, 34, 1)",
    ];

    if (chartType === "Pie Chart") {
      const pieValues = horizontalLabels.map((labelVal) => {
        const filteredMatches = data.filter(
          (item) => item[rowAxis] === labelVal,
        );
        if (aggregator === "Count") return filteredMatches.length;
        return filteredMatches.reduce(
          (sum, item) => sum + Math.abs(item[calcValue]),
          0,
        );
      });

      const pieData = {
        labels: horizontalLabels,
        datasets: [
          {
            label: aggregator === "Sum" ? "Suma" : "Kiekis",
            data: pieValues,
            backgroundColor: backgroundColors.slice(0, horizontalLabels.length),
            borderColor: borderColors.slice(0, horizontalLabels.length),
            borderWidth: 1,
          },
        ],
      };

      return (
        <div className="pie-chart-container">
          <Pie
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </div>
      );
    }

    const datasets = structuralSeries.map((seriesName, idx) => {
      const chartValues = horizontalLabels.map((labelVal) => {
        const filteredMatches = data.filter(
          (item) => item[rowAxis] === labelVal && item[colAxis] === seriesName,
        );
        if (aggregator === "Count") return filteredMatches.length;
        return filteredMatches.reduce((sum, item) => sum + item[calcValue], 0);
      });

      return {
        label: String(seriesName),
        data: chartValues,
        backgroundColor: backgroundColors[idx % backgroundColors.length],
        borderColor: borderColors[idx % borderColors.length],
        borderWidth: 2,
        tension: 0.2,
      };
    });

    const isStacked = chartType === "Stacked Column Chart";
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: isStacked },
        y: { stacked: isStacked },
      },
      plugins: { legend: { position: "bottom" } },
    };

    return (
      <div className="chart-container">
        {chartType === "Line Chart" ? (
          <Line
            data={{ labels: horizontalLabels, datasets }}
            options={options}
          />
        ) : (
          <Bar
            data={{ labels: horizontalLabels, datasets }}
            options={options}
          />
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="page-container" style={{ padding: "20px" }}>
        Kraunama analitika...
      </div>
    );
  if (data.length === 0)
    return (
      <div className="page-container" style={{ padding: "20px" }}>
        Nėra duomenų analizei.
      </div>
    );

  return (
    <div className="page-container">
      <div className="wrapper">
        <main>
          <div className="analytics-header">
            <h1>Finansų analizė</h1>
            <p className="analytics-subtitle">Jūsų duomenys - jūsų įžvalgos.</p>
          </div>

          <div className="choices-panel">
            <div className="analytics-field-group">
              <label className="choice-label">Vizualizacija:</label>
              <div className="select-wrapper">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="analytics-select-input"
                >
                  <option value="Table">Lentelė</option>
                  <option value="Grouped Column Chart">
                    Stulpelinė diagrama
                  </option>
                  <option value="Stacked Column Chart">
                    Juostinė diagrama
                  </option>
                  <option value="Line Chart">Linijinė diagrama</option>
                  <option value="Pie Chart">Skritulinė diagrama</option>
                </select>
                <span className="select-indicator">▾</span>
              </div>
            </div>

            <div className="analytics-field-group">
              <label className="choice-label">
                {chartType === "Pie Chart"
                  ? "Grupavimas (Sektoriai):"
                  : "Eilutės (X ašis):"}
              </label>
              <div className="select-wrapper">
                <select
                  value={rowAxis}
                  onChange={(e) => setRowAxis(e.target.value)}
                  className="analytics-select-input"
                >
                  {availableFields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <span className="select-indicator">▾</span>
              </div>
            </div>

            {chartType !== "Pie Chart" && (
              <div className="analytics-field-group">
                <label className="choice-label">Grupavimas:</label>
                <div className="select-wrapper">
                  <select
                    value={colAxis}
                    onChange={(e) => setColAxis(e.target.value)}
                    className="analytics-select-input"
                  >
                    {availableFields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-indicator">▾</span>
                </div>
              </div>
            )}

            <div className="analytics-field-group">
              <label className="choice-label">Agregacija:</label>
              <div className="select-wrapper">
                <select
                  value={aggregator}
                  onChange={(e) => setAggregator(e.target.value)}
                  className="analytics-select-input"
                >
                  <option value="Sum">Suma</option>
                  <option value="Count">Kiekis</option>
                </select>
                <span className="select-indicator">▾</span>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            {chartType === "Table" ? (
              <div className="table-wrapper">
                <PivotTable
                  data={data}
                  rows={[rowAxis]}
                  cols={[colAxis]}
                  vals={[calcValue]}
                  aggregatorName={aggregator}
                  rendererName="Table"
                  renderers={TableRenderers}
                />
              </div>
            ) : (
              renderChartSection()
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;

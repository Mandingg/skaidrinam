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
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataType, setDataType] = useState("");
  const [chartType, setChartType] = useState("");
  const [rowAxis, setRowAxis] = useState("");
  const [colAxis, setColAxis] = useState("");
  const [calcValue, setCalcValue] = useState("Suma");
  const [aggregator, setAggregator] = useState("");

  useEffect(() => {
  document.title = "Analitika";
}, []);

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
          Metai: item["Metai"],
          Suma: parseFloat(item["Suma"]),
        }));
        setRawData(adjustedData);
      } catch (error) {
        console.error("Klaida užkraunant analitikos duomenis:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  let availableFields = [];
  if (dataType === "išlaidos") {
    availableFields = [
      { id: "Metai", label: "Metai" },
      { id: "Mėnuo", label: "Mėnuo" },
      { id: "Išlaidų kategorija", label: "Išlaidų kategorija" },
      { id: "Parduotuvė", label: "Parduotuvė" },
    ];
  } else if (dataType === "pajamos") {
    availableFields = [
      { id: "Metai", label: "Metai" },
      { id: "Mėnuo", label: "Mėnuo" },
      { id: "Pajamų šaltinis", label: "Pajamų šaltinis" },
    ];
  } else if (dataType === "išlaidos ir pajamos") {
    availableFields = [
      { id: "Metai", label: "Metai" },
      { id: "Mėnuo", label: "Mėnuo" },
      { id: "Transakcijos tipas", label: "Transakcijos tipas" },
    ];
  }

  const handleDataTypeSelection = (e) => {
      setDataType(e.target.value);
      setChartType('Table');
    }

  useEffect(() => {
    if (dataType === "") {
      setRowAxis("");
      setColAxis("");
      setAggregator("");
    } else {
      if (!availableFields.some((f) => f.id === rowAxis)) {
        setRowAxis(availableFields[0]?.id || "");
      }
      if (!availableFields.some((f) => f.id === colAxis)) {
        setColAxis(availableFields[1]?.id || "");
      }
      if (!aggregator) {
        setAggregator("Sum");
      }
    }
  }, [dataType, rowAxis, colAxis]);

  useEffect(() => {
    if (dataType === "išlaidos") {
      setFilteredData(
        rawData.filter(
          (item) => item["Transakcijos tipas"]?.toLowerCase() === "išlaida",
        ),
      );
    } else if (dataType === "pajamos") {
      setFilteredData(
        rawData.filter(
          (item) => item["Transakcijos tipas"]?.toLowerCase() === "įplauka",
        ),
      );
    } else if (dataType === "išlaidos ir pajamos") {
      setFilteredData(rawData);
    }
  }, [dataType]);

  const renderChartSection = () => {
    if (
      !dataType ||
      filteredData.length === 0 ||
      !rowAxis ||
      (!colAxis && chartType !== "Pie Chart") ||
      !aggregator
    ) {
      return null;
    }

    const horizontalLabels = [
      ...new Set(filteredData.map((item) => item[rowAxis])),
    ].sort();
    const structuralSeries = [
      ...new Set(filteredData.map((item) => item[colAxis])),
    ].sort();

    const baseColors = [
      "rgba(69, 123, 59, 0.7)",
      "rgba(44, 122, 123, 0.7)",
      "rgba(192, 86, 43, 0.7)",
      "rgba(214, 158, 46, 0.7)",
      "rgba(112, 79, 130, 0.7)",
      "rgba(74, 85, 104, 0.7)",
      "rgba(184, 50, 90, 0.7)",
      "rgba(47, 133, 90, 0.7)",
      "rgba(221, 107, 32, 0.7)",
      "rgba(43, 108, 176, 0.7)",
    ];

    let backgroundColors = [];
    let borderColors = [];

    for (let i = 0; i < structuralSeries.length; i++) {
      const bgColor = baseColors[i % baseColors.length];
      const brdColor = bgColor.replace("0.7", "1.0");
      backgroundColors.push(bgColor);
      borderColors.push(brdColor);
    }

    

    if (chartType === "Pie Chart") {
      const pieValues = horizontalLabels.map((labelVal) => {
        const filteredMatches = filteredData.filter(
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
        <div className="pie-chart-container" aria-label="Finansų skritulinė diagrama" role="img">
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
        const filteredMatches = filteredData.filter(
          (item) => item[rowAxis] === labelVal && item[colAxis] === seriesName,
        );
        if (aggregator === "Count") return filteredMatches.length;
        return filteredMatches.reduce((sum, item) => sum + item[calcValue], 0);
      });

      return {
        label: String(seriesName),
        data: chartValues,
        backgroundColor: backgroundColors[idx],
        borderColor: borderColors[idx],
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
      <div className="chart-container" aria-label="Finansų diagrama" role="img">
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

  return (
    <div className="page-container">
      <div className="wrapper">
        <main className="analytics-main">
          <div className="analytics-header">
            <h1>Finansų analizė</h1>
            <p className="analytics-subtitle">Jūsų duomenys - jūsų įžvalgos.</p>
          </div>

          <div className="choices-panel">
            <div className="analytics-field-group">
              <label htmlFor="moneyType" className="choice-label">Duomenų tipas:</label>
              <div className="select-wrapper">
                <select
                  id="moneyType"
                  value={dataType}
                  onChange={handleDataTypeSelection}
                  className="analytics-select-input"
                >
                  <option value="">---</option>
                  <option value="išlaidos">Išlaidos</option>
                  <option value="pajamos">Pajamos</option>
                  <option value="išlaidos ir pajamos">
                    Išlaidos ir pajamos
                  </option>
                </select>
                <span className="select-indicator" aria-hidden="true">▾</span>
              </div>
            </div>

            <div className="analytics-field-group">
              <label htmlFor="dataType" className="choice-label">Vizualizacija:</label>
              <div className="select-wrapper">
                <select
                  id="dataType"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="analytics-select-input"
                  disabled={!dataType}
                >
                  {!dataType && <option value="">---</option>}
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
              <label htmlFor="rowAxisType" className="choice-label">
                {chartType === "Pie Chart"
                  ? "Grupavimas (Sektoriai):"
                  : "Eilutės (X ašis):"}
              </label>
              <div className="select-wrapper">
                <select
                  id="rowAxisType"
                  value={rowAxis}
                  onChange={(e) => setRowAxis(e.target.value)}
                  className="analytics-select-input"
                  disabled={!dataType}
                >
                  {(!dataType || !rowAxis) && <option value="">---</option>}
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
                <label htmlFor="colAxisType" className="choice-label">Grupavimas:</label>
                <div className="select-wrapper">
                  <select
                    id="colAxisType"
                    value={colAxis}
                    onChange={(e) => setColAxis(e.target.value)}
                    className="analytics-select-input"
                    disabled={!dataType}
                  >
                    {(!dataType || !colAxis) && <option value="">---</option>}
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
              <label htmlFor="equationType" className="choice-label">Agregacija:</label>
              <div className="select-wrapper">
                <select
                  id="equationType"
                  value={aggregator}
                  onChange={(e) => setAggregator(e.target.value)}
                  className="analytics-select-input"
                  disabled={!dataType}
                >
                  {(!dataType || !aggregator) && <option value="">---</option>}
                  <option value="Sum">Suma</option>
                  <option value="Count">Kiekis</option>
                </select>
                <span className="select-indicator">▾</span>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            {!dataType ? (
              <div
                style={{ textAlign: "center", padding: "40px", color: "#888" }}
              >
                Pasirinkite duomenų tipą analizei pradėti.
              </div>
            ) : filteredData.length == 0 ? (
              <div
                style={{ textAlign: "center", padding: "40px", color: "#888" }}
              >
                Neturite įrašų kategorijoje {`${dataType}`}.
              </div>
            ) : chartType === "Table" ? (
              
              <>
              <h2 id="pivotTableTitle" className="sr-only">
                Finansų analizės lentelė
              </h2>
              <div className="table-wrapper" role="region" aria-labelledby="pivotTableTitle">
                {rowAxis && colAxis && aggregator ? (
                  <PivotTable
                    data={filteredData}
                    rows={[rowAxis]}
                    cols={[colAxis]}
                    vals={[calcValue]}
                    aggregatorName={aggregator}
                    rendererName="Table"
                    renderers={TableRenderers}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#888",
                    }}
                  >
                    Pasirinkite eilutes ir grupavimo ašis.
                  </div>
                )}
              </div>
              </>
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

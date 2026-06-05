import { useEffect, useState } from "react";
import { getUserTransactions } from "../services/analyticsService";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

import * as ReactPlotly from 'react-plotly.js';

let Plot;
if (ReactPlotly.default && typeof ReactPlotly.default === 'function') {
  Plot = ReactPlotly.default;
} else if (ReactPlotly.default && ReactPlotly.default.default) {
  Plot = ReactPlotly.default.default;
} else if (typeof ReactPlotly === 'function') {
  Plot = ReactPlotly;
} else {
  Plot = ReactPlotly.default || Object.values(ReactPlotly).find(val => typeof val === 'function');
}
const PlotlyRenderers = createPlotlyRenderers(Plot);

function Analytics() {
  const [rawData, setRawData] = useState([]);
  const [pivotState, setPivotState] = useState({});

  useEffect(() => {
    document.title = "Analitika";
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      const data = await getUserTransactions();
      setRawData(data);
    };
    loadTransactions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Interactive Data Explorer</h2>
      <PivotTableUI
        data={rawData}
        onChange={(s) => setPivotState(s)}
        renderers={Object.assign({}, PlotlyRenderers)}
        {...pivotState}
      />
    </div>
  );
}

export default Analytics;

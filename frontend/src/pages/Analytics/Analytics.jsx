import { useState, useEffect } from 'react';
import PivotTable from 'react-pivottable/PivotTable';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';

import { getUserTransactions } from '../../services/analyticsService';
import './Analytics.css';

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
    Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [chartType, setChartType] = useState('Table');
    const [rowAxis, setRowAxis] = useState('Mėnuo');
    const [colAxis, setColAxis] = useState('Transakcijos tipas');
    const [calcValue, setCalcValue] = useState('Suma');
    const [aggregator, setAggregator] = useState('Sum');

    const availableFields = [
        { id: 'Mėnuo', label: 'Mėnuo' },
        { id: 'Transakcijos tipas', label: 'Transakcijos tipas' },
        { id: 'Išlaidų kategorija', label: 'Išlaidų kategorija' },
        { id: 'Parduotuvė', label: 'Parduotuvė' },
        { id: 'Pajamų šaltinis', label: 'Pajamų šaltinis' }
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const transactions = await getUserTransactions();
                const sanitized = transactions.map(item => ({
                    "Transakcijos tipas": item["Transakcijos tipas"] || "Nenurodyta",
                    "Išlaidų kategorija": item["Išlaidų kategorija"] || "Nenurodyta",
                    "Parduotuvė": item["Parduotuvė"] || "Nenurodyta",
                    "Pajamų šaltinis": item["Pajamų šaltinis"] || "Nenurodyta",
                    "Mėnuo": item["Mėnuo"] || "Nenurodyta",
                    "Suma": parseFloat(item["Suma"] || 0)
                }));
                setData(sanitized);
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

        const horizontalLabels = [...new Set(data.map(item => item[rowAxis]))].sort();
        const structuralSeries = [...new Set(data.map(item => item[colAxis]))].sort();

        const backgroundColors = [
            'rgba(54, 162, 235, 0.7)', 
            'rgba(255, 99, 132, 0.7)', 
            'rgba(75, 192, 192, 0.7)', 
            'rgba(241, 196, 15, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(230, 126, 34, 0.7)'
        ];
        const borderColors = [
            'rgba(54, 162, 235, 1)', 
            'rgba(255, 99, 132, 1)', 
            'rgba(75, 192, 192, 1)', 
            'rgba(241, 196, 15, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(230, 126, 34, 1)'
        ];

        if (chartType === 'Pie Chart') {
            const pieValues = horizontalLabels.map(labelVal => {
                const filteredMatches = data.filter(item => item[rowAxis] === labelVal);
                if (aggregator === 'Count') return filteredMatches.length;
                return filteredMatches.reduce((sum, item) => sum + Math.abs(item[calcValue]), 0);
            });

            const pieData = {
                labels: horizontalLabels,
                datasets: [{
                    label: aggregator === 'Sum' ? 'Suma' : 'Kiekis',
                    data: pieValues,
                    backgroundColor: backgroundColors.slice(0, horizontalLabels.length),
                    borderColor: borderColors.slice(0, horizontalLabels.length),
                    borderWidth: 1
                }]
            };

            return (
                <div className="analytics-pie-canvas-container">
                    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                </div>
            );
        }

        const datasets = structuralSeries.map((seriesName, idx) => {
            const chartValues = horizontalLabels.map(labelVal => {
                const filteredMatches = data.filter(
                    item => item[rowAxis] === labelVal && item[colAxis] === seriesName
                );
                if (aggregator === 'Count') return filteredMatches.length;
                return filteredMatches.reduce((sum, item) => sum + item[calcValue], 0);
            });

            return {
                label: String(seriesName),
                data: chartValues,
                backgroundColor: backgroundColors[idx % backgroundColors.length],
                borderColor: borderColors[idx % borderColors.length],
                borderWidth: 2,
                tension: 0.2
            };
        });

        const isStacked = chartType === 'Stacked Column Chart';
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: isStacked },
                y: { stacked: isStacked }
            },
            plugins: { legend: { position: 'bottom' } }
        };

        return (
            <div className="analytics-chart-canvas-container">
                {chartType === 'Line Chart' ? (
                    <Line data={{ labels: horizontalLabels, datasets }} options={options} />
                ) : (
                    <Bar data={{ labels: horizontalLabels, datasets }} options={options} />
                )}
            </div>
        );
    };

    if (loading) return <div className="analytics-page-container" style={{ padding: '20px' }}>Kraunama analitika...</div>;
    if (data.length === 0) return <div className="analytics-page-container" style={{ padding: '20px' }}>Nėra duomenų analizei.</div>;

    return (
        <div className="analytics-page-container">
            <div className="analytics-layout-flex">
                <main className="analytics-main-content">
                    
                    {/* Header Section */}
                    <div className="analytics-header">
                        <h2 className="analytics-title">Interaktyvi Finansinė Analizė</h2>
                        <p className="analytics-subtitle">Sukurkite savo asmeninę suvestinę ir grafikus realiu laiku</p>
                    </div>

                    {/* Control Board Grid Panel */}
                    <div className="analytics-control-panel">
                        <div className="analytics-field-group">
                            <label className="analytics-field-label">Vizualizacija:</label>
                            <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="analytics-select-input">
                                <option value="Table">Lentelė</option>
                                <option value="Grouped Column Chart">Stulpelinė diagrama (Grupinė)</option>
                                <option value="Stacked Column Chart">Stulpelinė diagrama (Sukrauta)</option>
                                <option value="Line Chart">Linijinė diagrama</option>
                                <option value="Pie Chart">Skritulinė (Pie) diagrama</option>
                            </select>
                        </div>

                        <div className="analytics-field-group">
                            <label className="analytics-field-label">
                                {chartType === 'Pie Chart' ? 'Grupavimas (Sektoriai):' : 'Eilutės (X ašis):'}
                            </label>
                            <select value={rowAxis} onChange={(e) => setRowAxis(e.target.value)} className="analytics-select-input">
                                {availableFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                            </select>
                        </div>

                        {chartType !== 'Pie Chart' && (
                            <div className="analytics-field-group">
                                <label className="analytics-field-label">Stulpeliai (Grupavimas):</label>
                                <select value={colAxis} onChange={(e) => setColAxis(e.target.value)} className="analytics-select-input">
                                    {availableFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="analytics-field-group">
                            <label className="analytics-field-label">Agregacija:</label>
                            <select value={aggregator} onChange={(e) => setAggregator(e.target.value)} className="analytics-select-input">
                                <option value="Sum">Suma (Sum)</option>
                                <option value="Count">Kiekis (Count)</option>
                            </select>
                        </div>
                    </div>

                    {/* Content Display Card */}
                    <div className="analytics-display-card">
                        {chartType === 'Table' ? (
                            <div className="analytics-table-scroll-wrapper">
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
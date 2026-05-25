import React, { useState, useEffect } from 'react';
import TopAppBar from './TopAppBar';
import SideNavBar from './SideNavBar';
import ExpenseFilters from './ExpenseFilters';
import { getUserCategories } from '../services/expenseService';


function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [sortBy, setSortBy] = useState('DATE_DESC');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getUserCategories();
            setCategories(data);
        };
        loadCategories()
    }, []);

    useEffect(() => {
        const loadExpenses = async ()=>{
            const data = await getUserExpenses();
            setExpenses(data);
        }
        loadExpenses();
    }, []);

    const filteredAndSortedExpenses = expenses
        .filter(expense => {
            const matchesSearch =
                expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.shop_name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === 'ALL' ||
                String(expense.category_id) === String(selectedCategory);

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'DATE_DESC') return new Date(b.date) - new Date(a.date);
            if (sortBy === 'DATE_ASC') return new Date(a.date) - new Date(b.date);
            if (sortBy === 'PRICE_ASC') return a.amount - b.amount;
            if (sortBy === 'PRICE_DESC') return b.amount - a.amount;
            return 0;
        });

    
       
    return (
        <div className="font-body-md text-body-md bg-surface-page min-h-screen">
            <TopAppBar />

            <div className="flex min-h-[calc(100vh-64px)]">

                {/* 🗂️ Iškeltas išorinis šoninis meniu */}
                <SideNavBar />

                {/* 📈 Pagrindinis turinys */}
                <main className="flex-1 ml-64 p-xl max-w-container-max mx-auto w-full">

                    <section className="mb-xl">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-lg">
                            <div>
                                <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Mano išlaidos</h1>
                                <p className="text-body-lg text-on-surface-variant">Peržiūrėkite ir valdykite visus užregistruotus kvitus.</p>
                            </div>
                        </div>

                        {/* 🎛️ Iškeltas filtrų skydelis (perduodame ir gautas kategorijas) */}
                        <ExpenseFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            categories={categories}
                        />
                    </section>

                    {/* KVITŲ LENTELĖ */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Paskutiniai kvitai</h3>
                            <button className="flex items-center gap-xs px-sm py-xs rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-on-surface-variant font-label-md">
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span>Eksportuoti CSV</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50">
                                        <th className="px-xl py-md font-label-lg text-label-lg text-on-surface-variant">Pavadinimas</th>
                                        <th className="px-md py-md font-label-lg text-label-lg text-on-surface-variant">Parduotuvė</th>
                                        <th className="px-md py-md font-label-lg text-label-lg text-on-surface-variant">Data</th>
                                        <th className="px-md py-md font-label-lg text-label-lg text-on-surface-variant">Kategorija</th>
                                        <th className="px-xl py-md font-label-lg text-label-lg text-on-surface-variant text-right">Suma</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {filteredAndSortedExpenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-surface-container-low transition-colors group">
                                            <td className="px-xl py-lg">
                                                <div className="flex items-center gap-md">
                                                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold">
                                                        {expense.badge}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-on-surface">{expense.title}</div>
                                                        <div className="text-caption text-on-surface-variant">Kvitas #{expense.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-md py-lg">
                                                <div className="flex items-center gap-xs">
                                                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">store</span>
                                                    <span className="text-on-surface">{expense.shop}</span>
                                                </div>
                                            </td>
                                            <td className="px-md py-lg text-on-surface-variant">{expense.date}</td>
                                            <td className="px-md py-lg">
                                                {/* Dinamiškai sugeneruojama kategorijos etiketė pagal ID */}
                                                {getCategoryBadge(expense.category_id)}
                                            </td>
                                            <td className="px-xl py-lg text-right font-bold text-on-surface">{expense.amount.toFixed(2)} €</td>
                                        </tr>
                                    ))}

                                    {filteredAndSortedExpenses.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-xl py-lg text-center text-on-surface-variant">
                                                Nėra kvitų, atitinkančių parinktus filtrus.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-xl py-md bg-surface-container-low/30 border-t border-outline-variant flex items-center justify-between">
                            <span className="font-label-md text-label-md text-on-surface-variant">
                                Rodoma 1-{filteredAndSortedExpenses.length} iš {filteredAndSortedExpenses.length} įrašų
                            </span>
                            <div className="flex gap-xs">
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant opacity-50 cursor-not-allowed">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary bg-primary text-on-primary font-bold">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant opacity-50 cursor-not-allowed">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <div className="fixed bottom-lg right-lg z-50">
                <button className="w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group">
                    <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform duration-300">add</span>
                </button>
            </div>
        </div>
    );
}

export default ExpensesPage;
import React from 'react';

function TopAppBar() {
  return (
    <header className="flex justify-between items-center h-16 px-md w-full sticky top-0 z-50 bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-sm">
        <span className="font-headline-lg text-headline-lg font-bold text-primary">Čekiukai</span>
      </div>
      <div className="flex items-center gap-md">
        <div className="flex gap-sm">
          <button className="p-xs rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <button className="p-xs rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">help</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-xs">
            <img alt="Vartotojo profilis" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMBo6Hw1m8iUK_mbYZKxVMq5v5okV6bii7F26Fm6sZJ_1W5hMBYuRAyv9mfVtgmIkmUGq59tT0Jo5oFkNHr3OxgB4CuWZ1vKqUm2s0oifGFfATFAERnGDlMt7fZuOhsBCwiK1HPsfY1DsLylaMPYLrEwSBqaTFa9VvlhTJoQUCfeKxuU4um6LKoRPN5CbtuJHTP_bkAFDSFWPeR2OTkCVhcT_E0aQvvkiS2NdwDvMnFyGy_mynRQiHnreCiQOeDC5dG412nJ_jnNI" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopAppBar;
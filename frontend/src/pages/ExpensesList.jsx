return(
<div class="flex items-center gap-md">
    <div class="hidden md:flex items-center bg-surface-container-low px-sm py-xs rounded-lg border border-outline-variant">
        <span class="material-symbols-outlined text-on-surface-variant text-sm mr-xs">search</span>
            <input class="bg-transparent border-none focus:ring-0 text-body-md w-64" placeholder="Ieškoti išlaidų..." type="text" />
    </div>
    <div class="flex gap-sm">
<button class="p-xs rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95">
<span class="material-symbols-outlined text-on-surface-variant">notifications</span>
</button>
<button class="p-xs rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95">
<span class="material-symbols-outlined text-on-surface-variant">help</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-xs">
<img alt="Vartotojo profilis" data-alt="A professional and clean studio headshot of a middle-aged man with a friendly expression. He is set against a soft, neutral studio background that aligns with a high-end corporate financial application. The lighting is balanced and professional, utilizing soft key lights to create a warm and approachable feeling. The aesthetic is modern and minimalistic, matching the organic green and neutral palette of the financial management UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMBo6Hw1m8iUK_mbYZKxVMq5v5okV6bii7F26Fm6sZJ_1W5hMBYuRAyv9mfVtgmIkmUGq59tT0Jo5oFkNHr3OxgB4CuWZ1vKqUm2s0oifGFfATFAERnGDlMt7fZuOhsBCwiK1HPsfY1DsLylaMPYLrEwSBqaTFa9VvlhTJoQUCfeKxuU4um6LKoRPN5CbtuJHTP_bkAFDSFWPeR2OTkCVhcT_E0aQvvkiS2NdwDvMnFyGy_mynRQiHnreCiQOeDC5dG412nJ_jnNI">
</div>
</div>
</div>
</header>
<div class="flex min-h-[calc(100vh-64px)]">
<!-- SideNavBar -->
<aside class="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col p-md bg-surface-sidebar border-r border-outline-variant z-40">
<div class="flex flex-col gap-xs mb-lg">
<div class="flex items-center gap-sm p-sm mb-md">
<div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary-container">receipt_long</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm font-bold text-primary">Čekiukai</div>
<div class="font-caption text-caption text-on-surface-variant">Finansų apskaita</div>
</div>
</div>
<nav class="flex flex-col gap-xs">
<a class="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-label-lg text-label-lg">Dashboard</span>
</a>
<a class="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">insights</span>
<span class="font-label-lg text-label-lg">Analytics</span>
</a>
<a class="flex items-center gap-md p-sm bg-primary-fixed text-on-primary-fixed rounded-lg font-bold transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">verified</span>
<span class="font-label-lg text-label-lg">Warranties</span>
</a>
<a class="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">person</span>
<span class="font-label-lg text-label-lg">Profile</span>
</a>
</nav>
</div>
<button class="h-14 w-full bg-primary text-on-primary font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-sm mt-auto mb-lg">
<span class="material-symbols-outlined">add_a_photo</span>
                Scan Receipt
            </button>
<div class="pt-md border-t border-outline-variant flex flex-col gap-xs">
<a class="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-label-lg text-label-lg">Settings</span>
</a>
<a class="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all text-error" href="#">
<span class="material-symbols-outlined">logout</span>
<span class="font-label-lg text-label-lg">Logout</span>
</a>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 ml-64 p-xl max-w-container-max mx-auto">
<!-- Page Header & Filters -->
<section class="mb-xl">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-lg">
<div>
<h1 class="font-display-lg text-display-lg text-on-surface mb-xs">Mano išlaidos</h1>
<p class="text-body-lg text-on-surface-variant">Peržiūrėkite ir valdykite visus užregistruotus kvitus.</p>
</div>
</div>
<!-- Filter Controls Grid -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-lg p-lg bg-surface-container-low border border-outline-variant rounded-xl">
<!-- Search Input -->
<div class="flex flex-col gap-xs">
<label class="font-label-md text-label-md text-on-surface-variant">Ieškoti kvitų</label>
<div class="relative">
<input class="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Pvz. Maxima..." type="text">
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
</div>
</div>
<!-- Date Range -->
<div class="flex flex-col gap-xs">
<label class="font-label-md text-label-md text-on-surface-variant">Laikotarpis</label>
<div class="relative">
<input class="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all" type="text" value="2023-10-01 - 2023-10-31">
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_month</span>
</div>
</div>
<!-- Category Filter -->
<div class="flex flex-col gap-xs">
<label class="font-label-md text-label-md text-on-surface-variant">Kategorija</label>
<div class="relative">
<select class="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all">
<option>Visos kategorijos</option>
<option>Maistas</option>
<option>Transportas</option>
<option>Namai</option>
</select>
<span class="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">category</span>
</div>
</div>
<!-- Sorting Menu -->
<div class="flex flex-col gap-xs">
<label class="font-label-md text-label-md text-on-surface-variant">Rūšiuoti pagal</label>
<div class="relative">
<select class="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all">
<option>Data (naujausi viršuje)</option>
<option>Data (seniausi viršuje)</option>
<option>Kaina (didėjanti)</option>
<option>Kaina (mažėjanti)</option>
</select>
<span class="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">sort</span>
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">swap_vert</span>
</div>
</div>
</div>
</section>
<!-- Stats/Bento Grid Area (Visual Depth) -->
<!-- Expenses List Card -->
<div class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
<div class="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
<h3 class="font-headline-sm text-headline-sm text-on-surface">Paskutiniai kvitai</h3>
<div class="flex gap-xs"><button class="flex items-center gap-xs px-sm py-xs rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-on-surface-variant font-label-md">
<span class="material-symbols-outlined text-[20px]">download</span>
<span class="">Eksportuoti CSV</span>
</button>


</div>
</div>
<div class="overflow-x-auto custom-scrollbar">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low/50">
<th class="px-xl py-md font-label-lg text-label-lg text-on-surface-variant">Pavadinimas</th>
<th class="px-md py-md font-label-lg text-label-lg text-on-surface-variant">Parduotuvė</th>
<th class="px-md py-md font-label-lg text-label-lg text-on-surface-variant">Data</th>
<th class="px-md py-md font-label-lg text-label-lg text-on-surface-variant">Kategorija</th>
<th class="px-xl py-md font-label-lg text-label-lg text-on-surface-variant text-right">Suma</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant">
<!-- Row 1 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-xl py-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold">M</div>
<div>
<div class="font-bold text-on-surface">Pieno produktai, Duona</div>
<div class="text-caption text-on-surface-variant">Kvitas #74291</div>
</div>
</div>
</td>
<td class="px-md py-lg">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-on-surface-variant text-[18px]">store</span>
<span class="text-on-surface">Maxima XX</span>
</div>
</td>
<td class="px-md py-lg text-on-surface-variant">2023-10-28</td>
<td class="px-md py-lg">
<span class="px-sm py-xs bg-brand-green-tint text-primary font-bold text-micro-label rounded-full uppercase">Maistas</span>
</td>
<td class="px-xl py-lg text-right font-bold text-on-surface">24.50 €</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-xl py-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold">N</div>
<div>
<div class="font-bold text-on-surface">Valymo priemonės</div>
<div class="text-caption text-on-surface-variant">Kvitas #12093</div>
</div>
</div>
</td>
<td class="px-md py-lg">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-on-surface-variant text-[18px]">store</span>
<span class="text-on-surface">Lidl</span>
</div>
</td>
<td class="px-md py-lg text-on-surface-variant">2023-10-27</td>
<td class="px-md py-lg">
<span class="px-sm py-xs bg-surface-container-high text-on-surface-variant font-bold text-micro-label rounded-full uppercase">Namai</span>
</td>
<td class="px-xl py-lg text-right font-bold text-on-surface">12.15 €</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-xl py-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold">C</div>
<div>
<div class="font-bold text-on-surface">Degalai A95</div>
<div class="text-caption text-on-surface-variant">Kvitas #88212</div>
</div>
</div>
</td>
<td class="px-md py-lg">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-on-surface-variant text-[18px]">store</span>
<span class="text-on-surface">Circle K</span>
</div>
</td>
<td class="px-md py-lg text-on-surface-variant">2023-10-25</td>
<td class="px-md py-lg">
<span class="px-sm py-xs bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-micro-label rounded-full uppercase">Transportas</span>
</td>
<td class="px-xl py-lg text-right font-bold text-on-surface">65.00 €</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-xl py-lg">
<div class="flex items-center gap-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold">S</div>
<div>
<div class="font-bold text-on-surface">Vitaminai C, D3</div>
<div class="text-caption text-on-surface-variant">Kvitas #55410</div>
</div>
</div>
</td>
<td class="px-md py-lg">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-on-surface-variant text-[18px]">store</span>
<span class="text-on-surface">Eurovaistinė</span>
</div>
</td>
<td class="px-md py-lg text-on-surface-variant">2023-10-24</td>
<td class="px-md py-lg">
<span class="px-sm py-xs bg-error-red-tint text-error-red font-bold text-micro-label rounded-full uppercase">Sveikata</span>
</td>
<td class="px-xl py-lg text-right font-bold text-on-surface">32.40 €</td>
</tr>
</tbody>
</table>
</div>
<div class="px-xl py-md bg-surface-container-low/30 border-t border-outline-variant flex items-center justify-between">
<span class="font-label-md text-label-md text-on-surface-variant">Rodoma 1-4 iš 42 įrašų</span>
<div class="flex gap-xs">
<button class="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant opacity-50 cursor-not-allowed">
<span class="material-symbols-outlined">chevron_left</span>
</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg border border-primary bg-primary text-on-primary font-bold">1</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors">2</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors">3</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</main>
</div>
<!-- Floating Action Button (FAB) -->
<div class="fixed bottom-lg right-lg z-50">
<button class="w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group">
<span class="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform duration-300">add</span>
</button>
</div>
)
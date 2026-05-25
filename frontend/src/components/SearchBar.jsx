function SearchBar({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  sortBy,
  setSortBy
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-lg p-lg bg-surface-container-low border border-outline-variant rounded-xl">
      
      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">Ieškoti išlaidų</label>
        <div className="relative">
          <input 
            className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md" 
            placeholder="Pvz. Maxima..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">Laikotarpis</label>
        <div className="relative">
          <input 
            className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md" 
            type="text" 
            defaultValue="2026-05-01 - 2026-05-31"
            readOnly
          />
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_month</span>
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">Kategorija</label>
        <div className="relative">
          <select 
            className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all text-body-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">Visos kategorijos</option>
            <option value="MAISTAS">Maistas</option>
            <option value="TRANSPORTAS">Transportas</option>
            <option value="NAMAI">Namai</option>
            <option value="SVEIKATA">Sveikata</option>
          </select>
          <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">category</span>
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">Rūšiuoti pagal</label>
        <div className="relative">
          <select 
            className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-xl focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all text-body-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="DATE_DESC">Data (naujausi viršuje)</option>
            <option value="DATE_ASC">Data (seniausi viršuje)</option>
            <option value="PRICE_ASC">Kaina (didėjanti)</option>
            <option value="PRICE_DESC">Kaina (mažėjanti)</option>
          </select>
          <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">sort</span>
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">swap_vert</span>
        </div>
      </div>

    </div>
  );
}

export default SearchBar;
function SearchBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories = [],
  selectedDate,
  setSelectedDate,
}) {
  const inputStyle = {
    height: "48px",
    width: "100%",
    backgroundColor: "var(--color-background)",
    border: "1px solid var(--color-secondary)",
    borderRadius: "var(--radius-sm)",
    color: "var(--color-neutral)",
    fontFamily: "var(--font-family)",
    fontSize: "var(--text-small)",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "var(--text-small)",
    color: "var(--color-neutral)",
    opacity: 0.8,
    fontWeight: "var(--font-weight-medium)",
    marginBottom: "4px",
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-4 gap-4 border"
      style={{
        backgroundColor: "var(--color-navigation)",
        borderColor: "var(--color-secondary)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-3)",
      }}
    >
      <div className="flex flex-col">
        <label style={labelStyle}>Ieškoti išlaidų</label>
        <div className="relative flex items-center">
          <input
            style={{ ...inputStyle, paddingLeft: "36px", paddingRight: "12px" }}
            placeholder="Pvz. Maxima..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label style={labelStyle}>Data</label>
        <div className="relative flex items-center">
          <input
            type="date"
            className="w-full px-3 text-sm font-medium cursor-pointer"
            style={{
              ...inputStyle,
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="absolute right-8 text-gray-400 hover:text-gray-600 font-bold text-xs"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              title="Išvalyti datą"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label style={labelStyle}>Kategorija</label>
        <div className="relative flex items-center">
          <select
            style={{
              ...inputStyle,
              paddingLeft: "36px",
              paddingRight: "32px",
              appearance: "none",
            }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">Visos kategorijos</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name.charAt(0) + category.name.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <span
            className="material-symbols-outlined absolute right-2.5 text-[20px] pointer-events-none"
            style={{ color: "var(--color-neutral)", opacity: 0.5 }}
          >
            ▾
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <label style={labelStyle}>Rūšiuoti pagal</label>
        <div className="relative flex items-center">
          <select
            style={{
              ...inputStyle,
              paddingLeft: "36px",
              paddingRight: "32px",
              appearance: "none",
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="DATE_DESC">Data (naujausi viršuje)</option>
            <option value="DATE_ASC">Data (seniausi viršuje)</option>
            <option value="PRICE_ASC">Kaina (didėjanti)</option>
            <option value="PRICE_DESC">Kaina (mažėjanti)</option>
          </select>
          <span
            className="material-symbols-outlined absolute right-2.5 text-[20px] pointer-events-none"
            style={{ color: "var(--color-neutral)", opacity: 0.5 }}
          >
            ▾
          </span>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

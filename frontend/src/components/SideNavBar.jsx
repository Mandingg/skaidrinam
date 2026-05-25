function SideNavBar() {
  return (
    <aside 
      className="fixed left-0 top-0 h-[calc(100vh-64px)] w-64 flex flex-col border-r z-40"
      style={{ 
        backgroundColor: "var(--color-navigation)", 
        borderColor: "var(--color-secondary)",
        padding: "var(--space-3)"
      }}
    >
      <div className="flex flex-col mb-4">
        <div className="flex items-center gap-3 border-b pb-4 mb-4" style={{ borderColor: "var(--color-secondary)" }}>
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span className="material-symbols-outlined"></span>
          </div>
          <div>
            <div className="font-bold" style={{ color: "var(--color-neutral)", fontSize: "var(--text-body)" }}>
              Čekiukai
            </div>
            <div style={{ color: "var(--color-neutral)", opacity: 0.6, fontSize: "var(--text-small)" }}>
              Finansų apskaita
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <a
            className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-black/5"
            style={{ color: "var(--color-neutral)", fontSize: "var(--text-body)" }}
            href="#"
          >
            <span>Dashboard</span>
          </a>
          

          <a
            className="flex items-center gap-3 p-2 rounded-lg font-bold transition-all"
            style={{ 
              backgroundColor: "var(--color-secondary)", 
              color: "var(--color-primary-dark)",
              fontSize: "var(--text-body)"
            }}
            href="#"
          >
            <span>Mano išlaidos</span>
          </a>
          
          <a
            className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-black/5"
            style={{ color: "var(--color-neutral)", fontSize: "var(--text-body)" }}
            href="#"
          >
            <span>Profilis</span>
          </a>
        </nav>
      </div>

      {/* Skenerio Mygtukas */}
      <button 
        className="h-12 w-full font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 mt-auto"
        style={{ 
          backgroundColor: "var(--color-primary)", 
          color: "#ffffff",
          borderRadius: "var(--radius-sm)",
          fontSize: "var(--text-body)"
        }}
      >
        Skenuoti kvitą
      </button>
    </aside>
  );
}

export default SideNavBar;
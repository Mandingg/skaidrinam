function SideNavBar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col p-md bg-surface-sidebar border-r border-outline-variant z-40">
      <div className="flex flex-col gap-xs mb-lg">
        <div className="flex items-center gap-sm p-sm mb-md">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container">receipt_long</span>
          </div>
          <div>
            <div className="font-headline-sm text-headline-sm font-bold text-primary">Čekiukai</div>
            <div className="font-caption text-caption text-on-surface-variant">Finansų apskaita</div>
          </div>
        </div>
        <nav className="flex flex-col gap-xs">
          <a className="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-lg text-label-lg">Dashboard</span>
          </a>
          <a className="flex items-center gap-md p-sm bg-primary-fixed text-on-primary-fixed rounded-lg font-bold transition-all" href="#">
            <span className="material-symbols-outlined">receipt</span>
            <span className="font-label-lg text-label-lg">Mano išlaidos</span>
          </a>
          <a className="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-lg text-label-lg">Profile</span>
          </a>
        </nav>
      </div>
      <button className="h-14 w-full bg-primary text-on-primary font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-sm mt-auto mb-lg">
        <span className="material-symbols-outlined">add_a_photo</span>
        Scan Receipt
      </button>
    </aside>
  );
}

export default SideNavBar;
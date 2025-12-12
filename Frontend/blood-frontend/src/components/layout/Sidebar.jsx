const navItems = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Donor List", icon: "🩸" },
  { label: "Requests", icon: "📨" },
  { label: "Blood Stock", icon: "📦" },
  { label: "Analytics", icon: "📊" },
  { label: "Settings", icon: "🚪" } // Changed icon to represent exit/logout
];

export default function Sidebar({ active = "Dashboard", onSelect = () => {}, onLogout }) {
  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-100 bg-white px-6 py-8 lg:flex">
      <div className="mb-10 flex items-center gap-2">
        <div className="rounded-2xl bg-brand-light px-3 py-2 text-xl text-brand-red">❤️</div>
        <div>
          <p className="text-lg font-bold text-slate-900">PulseCare</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">Blood Network</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => {
          // SPECIAL LOGIC: If the item is "Settings", treat it as a Logout button
          if (item.label === "Settings") {
             return (
               <button
                 key={item.label}
                 onClick={onLogout} // <--- This fires the logout function
                 className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
               >
                 <span className="text-lg">{item.icon}</span>
                 Logout
               </button>
             );
          }

          const isActive = item.label === active;
          return (
            <button
              key={item.label}
              onClick={() => onSelect(item.label)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand-light text-brand-red"
                  : "text-slate-500 hover:bg-brand-light hover:text-brand-red"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl bg-brand-light/70 p-4 text-xs text-brand-dark">
        <p className="font-semibold">Need donors urgently?</p>
        <p>Use AI-matching to locate compatible donors in seconds.</p>
      </div>
    </aside>
  );
}
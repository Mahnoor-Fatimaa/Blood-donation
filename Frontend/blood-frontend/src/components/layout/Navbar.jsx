import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function Navbar({ onNewRequest = () => {}, onSearch, user, onLogout, onOpenProfile }) {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials safely
  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex-1 pr-4">
        <Input
          type="search"
          placeholder="Search donors, requests, cities..."
          className="w-full"
          aria-label="Search"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onNewRequest}>
          New Request
        </Button>
        
        {/* DROPDOWN CONTAINER */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 transition hover:bg-slate-100 outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user ? user.full_name : "Loading..."}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {user ? user.role : "..."}
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand-red">
              {initials}
            </span>
          </button>

          {/* DROPDOWN MENU */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenProfile) onOpenProfile(); // Switch to Profile Page
                }}
                className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                👤 My Profile
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (onLogout) onLogout(); // Trigger Logout
                }}
                className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
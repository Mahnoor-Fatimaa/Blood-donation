import { useState, useEffect } from "react";
import { getDonors } from "../../services/api"; // We added this function earlier
import Card from "../ui/Card";

export default function DonorDashboard() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // 1. Fetch Donors on Load
  useEffect(() => {
    async function loadDonors() {
      const token = localStorage.getItem("token");
      try {
        const data = await getDonors(token);
        setDonors(data);
      } catch (err) {
        console.error("Failed to load donors", err);
      } finally {
        setLoading(false);
      }
    }
    loadDonors();
  }, []);

  // 2. Filter Logic (Search by Name, City, or Blood Group)
  const filteredDonors = donors.filter((d) => {
    const search = filter.toLowerCase();
    return (
      d.full_name.toLowerCase().includes(search) ||
      d.city.toLowerCase().includes(search) ||
      d.blood_group.toLowerCase().includes(search)
    );
  });

  if (loading) return <div className="p-4 text-center text-slate-500">Loading directory...</div>;

  return (
    <div className="space-y-6">
      {/* Search Bar specific to this list */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Filter by Name, City (e.g. Lahore), or Group (e.g. O+)..."
          className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="text-xs font-medium text-slate-400">
          {filteredDonors.length} found
        </span>
      </div>

      {/* Grid of Donors */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-brand-light hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{donor.full_name}</h3>
                <p className="text-xs text-slate-500">{donor.city}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-brand-red">
                {donor.blood_group}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="text-xs">
                    <p className="text-slate-400">Age</p>
                    <p className="font-medium text-slate-700">{donor.age} yrs</p>
                </div>
                <div className="text-xs text-right">
                    <p className="text-slate-400">Last Donation</p>
                    <p className="font-medium text-slate-700">
                        {donor.last_donation_date || "Never"}
                    </p>
                </div>
            </div>
            
            {/* Contact Button (Mock) */}
            <button className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white transition hover:bg-brand-red">
              Contact Donor
            </button>
          </div>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="py-10 text-center text-slate-400">
          No donors found matching "{filter}"
        </div>
      )}
    </div>
  );
}
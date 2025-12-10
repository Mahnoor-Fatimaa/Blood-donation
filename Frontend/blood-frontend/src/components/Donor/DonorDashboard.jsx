import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { getDonors } from "../../services/api";

export default function DonorDashboard() {
  const [donors, setDonors] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setStatus("loading");
    getDonors(token)
      .then(data => {
        setDonors(data || []);
        setStatus("idle");
      })
      .catch(err => {
        console.error(err);
        setStatus("error");
      });
  }, []);

  return (
    <div className="space-y-4">
      <Card title="Donor Directory" description="Registered donors from the database.">
        {status === "loading" && (
          <p className="text-xs text-slate-500">Loading donors...</p>
        )}
        {status === "error" && (
          <p className="text-xs text-red-500">Failed to load donors.</p>
        )}
        {status === "idle" && donors.length === 0 && (
          <p className="text-xs text-slate-500">No donors found yet.</p>
        )}
        {donors.length > 0 && (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Blood Group</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">Last Donation</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr
                    key={donor.id}
                    className="rounded-2xl bg-slate-50 text-slate-700 shadow-soft ring-1 ring-slate-100"
                  >
                    <td className="px-3 py-2 text-slate-900">{donor.full_name}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                        {donor.blood_group}
                      </span>
                    </td>
                    <td className="px-3 py-2">{donor.city}</td>
                    <td className="px-3 py-2 text-sm text-slate-500">
                      {donor.last_donation_date || "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button size="md" variant="secondary" className="text-xs">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

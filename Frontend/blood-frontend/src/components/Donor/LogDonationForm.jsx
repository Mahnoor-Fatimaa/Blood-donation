import { useState } from "react";
import { logDonation } from "../../services/api";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LogDonationForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    hospital: "",
    blood_group: "",
    date: new Date().toISOString().split('T')[0],
    units: 1
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await logDonation(token, form);
      // FIX: No alert, no reload. Just call the success handler.
      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error(err);
      alert("Failed to save donation."); // Keep error alert for now or handle gracefully
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input 
          label="Hospital / Location" 
          placeholder="e.g. City Hospital" 
          required
          value={form.hospital}
          onChange={e => setForm({...form, hospital: e.target.value})}
        />
        <label className="flex flex-col text-sm font-medium text-slate-600">
            <span className="mb-1">Blood Group</span>
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-light"
              value={form.blood_group}
              onChange={e => setForm({ ...form, blood_group: e.target.value })}
              required
            >
              <option value="">Select</option>
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input 
          label="Date of Donation" 
          type="date"
          required
          value={form.date}
          onChange={e => setForm({...form, date: e.target.value})}
        />
        <Input 
          label="Units (Bags)" 
          type="number"
          min="1"
          value={form.units}
          onChange={e => setForm({...form, units: parseInt(e.target.value)})}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Record"}
        </Button>
      </div>
    </form>
  );
}
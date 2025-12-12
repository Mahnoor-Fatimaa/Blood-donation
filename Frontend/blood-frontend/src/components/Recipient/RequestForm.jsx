import { useState } from "react";
import { createRecipientRequest } from "../../services/api";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function RequestForm({ onSuccess }) {
  const [form, setForm] = useState({
    blood_group: "O+",
    city: "",
    urgency: "Normal"
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await createRecipientRequest(token, {
        ...form,
        urgency: form.urgency.toLowerCase()
      });
      
      setForm({ ...form, city: "" });
      
      // FIX: No alert. Just trigger success.
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error(err);
      alert("Failed to post request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-600">
            <span className="mb-1">Blood Group</span>
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-light"
              value={form.blood_group}
              onChange={e => setForm({ ...form, blood_group: e.target.value })}
            >
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
        </label>
        <Input 
          label="City" 
          placeholder="e.g. Lahore" 
          required 
          value={form.city}
          onChange={e => setForm({...form, city: e.target.value})}
        />
      </div>

      <label className="flex flex-col text-sm font-medium text-slate-600">
        <span className="mb-1">Urgency</span>
        <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-light"
            value={form.urgency}
            onChange={e => setForm({ ...form, urgency: e.target.value })}
        >
            <option>Normal</option>
            <option>High</option>
            <option>Critical</option>
        </select>
      </label>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
import { useState } from "react";
import { createRecipientRequest } from "../../services/api";
import Input from "../ui/Input";
import Button from "../ui/Button";

const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function RequestForm() {
  const [form, setForm] = useState({
    blood_group: "",
    city: "",
    urgency: "normal"
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = 1; // fixed for demo, update after authentication
    const result = await createRecipientRequest(token, userId, form);
    console.log(result);
    alert("Request posted");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="flex flex-col text-sm font-medium text-slate-600">
            <span className="mb-1">Blood Group</span>
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none transition-all duration-200 focus:border-brand-red focus:ring-2 focus:ring-brand-light"
              value={form.blood_group}
              onChange={e => setForm({ ...form, blood_group: e.target.value })}
            >
              <option value="">Select blood group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Input
          label="City"
          placeholder="e.g. Lahore"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
        />
      </div>

      <label className="flex flex-col text-sm font-medium text-slate-600">
        <span className="mb-1">Urgency</span>
        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none transition-all duration-200 focus:border-brand-red focus:ring-2 focus:ring-brand-light"
          value={form.urgency}
          onChange={e => setForm({ ...form, urgency: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>

      <p className="text-xs text-slate-500">
        Provide the most accurate information possible so we can match donors quickly and safely.
      </p>

      <div className="flex justify-end pt-2">
        <Button type="submit">Submit request</Button>
      </div>
    </form>
  );
}

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

  // Updated handleSubmit function
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // 1. Check if token exists
    if (!token) {
      alert("You must be logged in to submit a request.");
      return;
    }

    // 2. Try to submit the request
    try {
      // The backend extracts the userId automatically from the token
      const result = await createRecipientRequest(token, form);
      console.log(result);
      alert("Request posted successfully!");
      
      // Optional: clear form after success
      // setForm({ blood_group: "", city: "", urgency: "normal" }); 
      
    } catch (err) {
      console.error("Failed to post request:", err);
      alert("Failed to post request. Check console for details.");
    }
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
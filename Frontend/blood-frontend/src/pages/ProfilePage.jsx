import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProfile, updateProfile } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | saving | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setStatus("loading");
    getProfile(token)
      .then(data => {
        setProfile(data);
        setForm({
          full_name: data.full_name,
          phone_number: data.phone_number || "",
          age: data.age || "",
          blood_group: data.blood_group || "",
          city: data.city || "",
          last_donation_date: data.last_donation_date || ""
        });
        setStatus("idle");
      })
      .catch(() => {
        setError("Failed to load profile.");
        setStatus("error");
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    setStatus("saving");
    setError("");
    try {
      const updated = await updateProfile(token, form);
      setProfile(updated);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
      setStatus("error");
    }
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row"
      >
        <div className="md:w-1/3">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">
              My account
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Profile</h1>
            <p className="mt-2 text-xs text-slate-500">
              Update your personal information used for matching and communication.
            </p>
            <div className="mt-4 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Email</p>
              <p>{profile.email}</p>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Role</p>
              <p className="capitalize">{profile.role}</p>
            </div>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full name"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                />
                <Input
                  label="Phone number"
                  value={form.phone_number}
                  onChange={e => setForm({ ...form, phone_number: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Age"
                  type="number"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Blood group"
                  value={form.blood_group}
                  onChange={e => setForm({ ...form, blood_group: e.target.value })}
                />
                <Input
                  label="Last donation date"
                  type="date"
                  value={form.last_donation_date || ""}
                  onChange={e =>
                    setForm({ ...form, last_donation_date: e.target.value })
                  }
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              {status === "success" && (
                <p className="text-xs text-emerald-600">Profile updated successfully.</p>
              )}
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={status === "saving"}>
                  {status === "saving" ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}



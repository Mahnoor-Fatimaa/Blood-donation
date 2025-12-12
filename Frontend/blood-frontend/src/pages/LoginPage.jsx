import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function LoginPage({ onSwitchToRegister, onLoginSuccess }) {
  // Initialize with empty strings
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await loginUser(form);
      console.log("Login Success:", result);
      
      localStorage.setItem("token", result.access_token);
      
      if (onLoginSuccess) {
        onLoginSuccess(result.access_token);
      } else {
        window.location.reload();
      }

    } catch (err) {
      console.error("Login Failed:", err);
      setError("Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-sm text-slate-500">Please enter your details.</p>
          </div>

          {/* FIX: added autoComplete="off" */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <Input
              label="Email"
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              // FIX: This forces browsers to ignore saved emails
              autoComplete="off" 
              name="email_new_login" // Random name helps trick Chrome
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              // FIX: "new-password" prevents autofill on login forms
              autoComplete="new-password"
              name="password_new_login"
            />

            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            No account? <button type="button" onClick={onSwitchToRegister} className="font-bold text-red-600 hover:underline">Register</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
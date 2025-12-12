import { useState } from "react";
import { loginUser } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage({ onSwitchToRegister, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // 1. Call Real Database Endpoint
      const result = await loginUser(form);
      console.log("Login Success:", result);
      
      // 2. Save Token
      localStorage.setItem("token", result.access_token);
      
      // 3. Notify App to Switch View
      if (onLoginSuccess) {
        onLoginSuccess(result.access_token);
      } else {
        window.location.reload();
      }

    } catch (err) {
      console.error("Login Failed:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-sm text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="off"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
            />

            {error && <p className="text-center text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            No account? <button type="button" onClick={onSwitchToRegister} className="font-bold text-brand-red hover:underline">Register Now</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
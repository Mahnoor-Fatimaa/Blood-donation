import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  // --- EMERGENCY DEBUG MODE ---
  // We will force the app to start on the Login screen, even if a token exists.
  const [token, setToken] = useState(null); 
  const [authPage, setAuthPage] = useState("login");

  // Manual Login Handler
  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  // Manual Logout Handler
  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setAuthPage("login");
  }

  // 1. If we have a token in state, show Dashboard
  if (token) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // 2. If user wants to register
  if (authPage === "register") {
    return <RegisterPage onSwitchToLogin={() => setAuthPage("login")} />;
  }

  // 3. Otherwise, show Login
  return (
    <LoginPage 
      onLoginSuccess={handleLogin} // Passing the missing prop
      onSwitchToRegister={() => setAuthPage("register")} 
    />
  );
}
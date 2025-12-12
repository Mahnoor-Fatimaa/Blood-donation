import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import DonorDashboard from "../components/Donor/DonorDashboard";
import RequestForm from "../components/Recipient/RequestForm";
import ProfilePage from "./ProfilePage";
import LogDonationForm from "../components/Donor/LogDonationForm";

// Import API functions
import { getProfile, getDashboardStats } from "../services/api";

// Dummy data for the "Trend" chart (Visual placeholder)
const dummyTrend = [
  { day: "Mon", units: 12 }, { day: "Tue", units: 18 }, { day: "Wed", units: 25 },
  { day: "Thu", units: 20 }, { day: "Fri", units: 35 }, { day: "Sat", units: 40 }, { day: "Sun", units: 30 }
];

export default function AdminDashboard({ onLogout }) {
  const [openModal, setOpenModal] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- REAL DATA STATE ---
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_donors: 0,
    pending_requests: 0,
    recent_donations_count: 0,
    stock_levels: [],
    recent_activity: []
  });

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    async function fetchData() {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch Profile (Who am I?)
            const profileData = await getProfile(token);
            setUser(profileData);

            // 2. Fetch Real Stats (Database numbers)
            const statsData = await getDashboardStats(token);
            if(statsData) setStats(statsData);

        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  // --- PREPARE DATA FOR UI ---
  const metricCards = [
    { label: "Total Donors", value: stats.total_donors, change: "Registered Users" },
    { label: "Pending Requests", value: stats.pending_requests, change: "Active Cases" },
    { 
        label: "Available Blood Units", 
        value: stats.stock_levels.reduce((sum, item) => sum + item.units, 0), 
        change: "Total Capacity" 
    },
    { label: "Recent Donations", value: stats.recent_donations_count, change: "Last 30 Days" }
  ];

  const chartData = stats.stock_levels.length > 0 ? stats.stock_levels : [{group: "No Data", units: 0}];

  // --- VIEW ROUTING ---
  function renderContent() {
    if (activeView === "Donor List") return <section className="p-6"><Card><DonorDashboard/></Card></section>;
    if (activeView === "Requests") return <section className="p-6"><Card title="New Request"><RequestForm/></Card></section>;
    if (activeView === "Profile") return <ProfilePage />;

    // MAIN DASHBOARD VIEW
    return (
      <section className="space-y-8 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">Overview</p>
            <h1 className="text-3xl font-bold text-slate-900">
                {/* Show Real Name safely */}
                Welcome, {user?.full_name ? user.full_name.split(" ")[0] : "User"}
            </h1>
            <p className="text-sm text-slate-500">Real-time data from PulseCare Database.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setOpenModal(true)}>Log Donation</Button>
          </div>
        </div>

        {/* 1. REAL METRIC CARDS */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(card => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="space-y-2">
                <p className="text-sm font-semibold text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-brand-dark">{card.change}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 2. STOCK CHART (REAL DATA) */}
          <Card title="Donor Distribution" description="Registered donors by blood group." className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="units" fill="#99151A" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 3. RECENT ACTIVITY (REAL DATA) */}
          <Card title="Recent Activity" description="Latest history from database.">
            <div className="space-y-4">
              {stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((act, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-3 hover:bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-900">{act.donor}</p>
                      <p className="text-sm text-slate-500">{act.city}</p>
                    </div>
                    <div className="text-right">
                      <span className="mr-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {act.group}
                      </span>
                      <p className="text-xs text-slate-400">{act.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 py-4 text-center">No recent activity found.</p>
              )}
            </div>
          </Card>
        </div>
      </section>
    );
  }

  // --- LOADING STATE ---
  if (loading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-red border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-500">Loading PulseCare Dashboard...</p>
            </div>
        </div>
      );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950">
      <div className="flex">
        {/* SIDEBAR: Pass onLogout */}
        <Sidebar active={activeView} onSelect={setActiveView} onLogout={onLogout} />
        
        <main className="flex-1">
          {/* NAVBAR: Pass user, search, logout, and profile handlers */}
          <Navbar 
            user={user} 
            onNewRequest={() => setActiveView("Requests")} 
            onSearch={setSearchTerm}
            onLogout={onLogout}
            onOpenProfile={() => setActiveView("Profile")} 
          />
          {renderContent()}
        </main>
      </div>

       {/* LOG DONATION MODAL */}
       <Modal open={openModal} onClose={() => setOpenModal(false)} title="Log New Donation">
            <LogDonationForm onClose={() => setOpenModal(false)} />
       </Modal>
    </div>
  );
}
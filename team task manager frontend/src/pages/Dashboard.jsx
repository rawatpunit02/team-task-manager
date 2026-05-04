import { useEffect, useState } from "react";
import api from "../api/api.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data.data);
        console.log("Dashboard stats:", response);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total tasks"
          value={loading ? "..." : stats.totalTasks}
        />
        <StatCard
          label="Completed"
          value={loading ? "..." : stats.completedTasks}
        />
        <StatCard label="Overdue" value={loading ? "..." : stats.overdueTasks} />
      </div>
    </section>
  );
};

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
};

export default Dashboard;

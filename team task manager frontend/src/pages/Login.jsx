import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { setAuth } from "../utils/auth.js";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", form);
      setAuth(response.data.data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-950">Login</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to manage your tasks.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            required
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          No account?{" "}
          <Link to="/signup" className="font-medium text-blue-700">
            Signup
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;

import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth.js";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/dashboard" className="font-semibold text-slate-950">
          Team Task Manager
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "font-medium text-blue-700" : "text-slate-600"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? "font-medium text-blue-700" : "text-slate-600"
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "font-medium text-blue-700" : "text-slate-600"
            }
          >
            Projects
          </NavLink>
          <span className="hidden text-slate-500 sm:inline">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={logout}
            className="rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default App;

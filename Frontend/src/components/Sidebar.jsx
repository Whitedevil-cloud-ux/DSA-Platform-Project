import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  LogOut,
} from "lucide-react";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItemStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
      isActive
        ? "bg-indigo-100 text-indigo-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">

      <div>
        <div className="px-6 py-6 text-2xl font-bold text-indigo-600 tracking-tight">
          DSA Platform
        </div>

        <nav className="px-4 space-y-2">

          <NavLink to="/dashboard" className={navItemStyle}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/problems" className={navItemStyle}>
            <BookOpen size={18} />
            Problems
          </NavLink>

          <NavLink to="/analytics" className={navItemStyle}>
            <BarChart3 size={18} />
            Analytics
          </NavLink>

        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full justify-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;

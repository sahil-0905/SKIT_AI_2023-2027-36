import { Link, useNavigate, useLocation } from "react-router-dom";
import { Code2, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 ${
      isActive(path)
        ? "bg-accent-soft text-accent"
        : "text-muted hover:bg-panel2 hover:text-text"
    }`;

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-panel border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      
      <Link to="/" className="flex items-center gap-2.5 group">
        <div
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-white font-bold text-sm
                     shadow-[0_4px_0_rgba(0,0,0,0.25),0_6px_14px_rgba(124,92,245,0.35)]
                     group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_0_rgba(0,0,0,0.25),0_10px_18px_rgba(124,92,245,0.4)]
                     transition-all duration-150 ease-out"
        >
          {"</>"}
        </div>
        <span className="font-bold text-text hidden sm:block">AI-Powered Coding Platform</span>
      </Link>

      <div className="flex items-center gap-2">
        
        {!token && (
          <>
            <Link to="/login" className={linkClass("/login")}>
              <LogIn size={15} /> Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-1.5 bg-accent text-white text-sm font-bold px-4 py-2 rounded-lg
                         shadow-[0_4px_0_rgba(0,0,0,0.2),0_6px_14px_rgba(124,92,245,0.35)]
                         hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2),0_10px_18px_rgba(124,92,245,0.4)]
                         active:translate-y-0 active:shadow-[0_2px_0_rgba(0,0,0,0.2)]
                         transition-all duration-150"
            >
              <UserPlus size={15} /> Sign Up
            </Link>
          </>
        )}

        {token && role === "student" && (
          <>
            <Link to="/student-dashboard" className={linkClass("/student-dashboard")}>
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link to="/practice" className={linkClass("/practice")}>
              <Code2 size={15} /> Practice
            </Link>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red font-semibold px-4 py-2 rounded-lg hover:bg-red/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              <LogOut size={15} /> Logout
            </button>
          </>
        )}

        {token && role === "interviewer" && (
          <>
            <Link to="/interviewer-dashboard" className={linkClass("/interviewer-dashboard")}>
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red font-semibold px-4 py-2 rounded-lg hover:bg-red/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              <LogOut size={15} /> Logout
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Navbar;
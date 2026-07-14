import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully");

    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600 transition";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-blue-600 tracking-wide"
        >
          HireHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">

          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>

          <NavLink to="/saved-jobs" className={navLinkClass}>
            Saved Jobs
          </NavLink>

          <NavLink to="/applied-jobs" className={navLinkClass}>
            Applied Jobs
          </NavLink>

          <NavLink to="/employer-dashboard" className={navLinkClass}>
            Employer
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                {user.name}
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-800"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-white shadow-lg ${
          menuOpen ? "max-h-[700px] py-5" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 gap-5">

          <NavLink to="/" className={navLinkClass} onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/jobs" className={navLinkClass} onClick={closeMenu}>
            Jobs
          </NavLink>

          <NavLink to="/saved-jobs" className={navLinkClass} onClick={closeMenu}>
            Saved Jobs
          </NavLink>

          <NavLink to="/applied-jobs" className={navLinkClass} onClick={closeMenu}>
            Applied Jobs
          </NavLink>

          <NavLink
            to="/employer-dashboard"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Employer
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={navLinkClass}
                onClick={closeMenu}
              >
                {user.name}
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="bg-red-500 text-white py-3 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Register
              </NavLink>

              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-center font-semibold"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;
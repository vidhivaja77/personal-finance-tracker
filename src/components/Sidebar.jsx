import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  IndianRupee,
  Wallet,
  Target,
  Receipt,
  LogOut,
  PiggyBank,
  BarChart2 
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="sidebar">

      {/* TOP SECTION */}
      <div className="sidebar-top">

        <h2 className="sidebar-logo">Fintrack</h2>

        <ul className="sidebar-menu">

          {/* Dashboard */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Add Income */}
          <li>
            <NavLink
              to="/add-income"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <IndianRupee size={20} />
              <span>Add Income</span>
            </NavLink>
          </li>

          {/* Add Expense */}
          <li>
            <NavLink
              to="/add-expense"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <Wallet size={20} />
              <span>Add Expense</span>
            </NavLink>
          </li>

          {/* Budget */}
          <li>
            <NavLink
              to="/budget"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <Target size={20} />
              <span>Budget</span>
            </NavLink>
          </li>

          {/* Transactions */}
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <Receipt size={20} />
              <span>Transactions</span>
            </NavLink>
          </li>

          {/* ⭐ Savings Goal */}
          <li>
            <NavLink
              to="/savings"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <PiggyBank size={20} />
              <span>Savings Goal</span>
            </NavLink>
          </li>
          <li>
  <NavLink
    to="/report"
    className={({ isActive }) =>
      isActive ? "menu-link active" : "menu-link"
    }
  >
    <BarChart2 size={20} />
    <span>Financial Report</span>
  </NavLink>
</li>

        </ul>
      </div>

      {/* LOGOUT BUTTON */}
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>

    </div>
  );
}

export default Sidebar;
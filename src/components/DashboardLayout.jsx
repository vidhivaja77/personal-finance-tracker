import Sidebar from "./Sidebar";
import "../styles/dashboard.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
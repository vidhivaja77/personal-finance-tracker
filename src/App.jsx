import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Footer from "./components/Footer";

/* PAGES */
import How from "./pages/How";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/AddIncome";
import AddExpense from "./pages/AddExpense";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import SavingsGoal from "./pages/SavingsGoal";
import Report from "./pages/Report";

/* HOME */
function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />

      <div className="app-shell">
        <Routes>

          {/* MAIN */}
          <Route path="/" element={<Home />} />

          {/* NAVBAR PAGES */}
          <Route path="/how" element={<How />} />
          <Route path="/features" element={<Features />} />

          {/* AUTH */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* APP */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-income" element={<AddIncome />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/savings" element={<SavingsGoal />} />
          <Route path="/report" element={<Report />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
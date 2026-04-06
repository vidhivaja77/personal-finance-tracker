import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  /* ✅ AI STATE */
  const [aiMessage, setAiMessage] = useState("");

  // Get user data on component mount
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
      console.log("User data loaded:", userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Fetching data for user:", user.id);

      // Fetch income and expense data
      const [incomeResponse, expenseResponse] = await Promise.all([
        fetch(`/api/income/${user.id}`),
        fetch(`/api/expense/${user.id}`)
      ]);

      const incomeData = incomeResponse.ok ? await incomeResponse.json() : { income: [] };
      const expenseData = expenseResponse.ok ? await expenseResponse.json() : { expenses: [] };

      console.log("Income data:", incomeData);
      console.log("Expense data:", expenseData);

      const incomeArray = incomeData.income || [];
      const expenseArray = expenseData.expenses || [];

      const totalIncome = incomeArray.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      const totalExpense = expenseArray.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      setIncome(totalIncome);
      setExpense(totalExpense);

      /* MONTHLY SUMMARY */
      const months = [
        "Jan","Feb","Mar","Apr",
        "May","Jun","Jul","Aug",
        "Sep","Oct","Nov","Dec"
      ];

      const summary = months.map((month,index)=>{

        const monthIncome = incomeArray
          .filter(item=>{
            const d = new Date(item.date);
            return d.getMonth() === index;
          })
          .reduce((sum,i)=>sum+Number(i.amount),0);

        const monthExpense = expenseArray
          .filter(item=>{
            const d = new Date(item.date);
            return d.getMonth() === index;
          })
          .reduce((sum,i)=>sum+Number(i.amount),0);

        return {
          month,
          income: monthIncome,
          expense: monthExpense
        };

      });

      setMonthlyData(summary);

      /* YEARLY SUMMARY */
      const years = {};

      incomeArray.forEach((item) => {
        const year = new Date(item.date).getFullYear();
        if (!years[year]) {
          years[year] = { year, income: 0, expense: 0 };
        }
        years[year].income += Number(item.amount);
      });

      expenseArray.forEach((item) => {
        const year = new Date(item.date).getFullYear();
        if (!years[year]) {
          years[year] = { year, income: 0, expense: 0 };
        }
        years[year].expense += Number(item.amount);
      });

      setYearlyData(Object.values(years));

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh function for external calls
  window.refreshDashboard = fetchData;

  const balance = income - expense;

  const pieData = [
    { name:"Income", value:income },
    { name:"Expense", value:expense }
  ];

  const COLORS = ["#48bb78","#f56565"];

  /* ✅ AI LOGIC */
  const handleAI = () => {

    if (income === 0) {
      setAiMessage("⚠️ Add income first to analyze");
      return;
    }

    const ratio = (expense / income) * 100;

    if (ratio > 80) {
      setAiMessage("⚠️ You are spending too much! Try reducing expenses.");
    } 
    else if (ratio > 50) {
      setAiMessage("⚡ Moderate spending. Try saving more.");
    } 
    else {
      setAiMessage("✅ Excellent! You are managing money well.");
    }
  };

  return (

    <DashboardLayout>

      <h1 className="dashboard-title">
        Welcome Back {user?.name || "User"} 👋
      </h1>

      {/* TOP CARDS */}
      <div className="cards">

        <div className="card income">
          <h3>Total Income</h3>
          <p>{loading ? "Loading..." : `₹${income}`}</p>
        </div>

        <div className="card expense">
          <h3>Total Expense</h3>
          <p>{loading ? "Loading..." : `₹${expense}`}</p>
        </div>

        <div className="card balance">
          <h3>Balance</h3>
          <p>{loading ? "Loading..." : `₹${balance}`}</p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="charts">

        {/* PIE */}
        <div className="chart-box">
          <h3>Income vs Expense</h3>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="45%"
                outerRadius={110}
                label={({ value }) => `₹${value}`}
              >
                {pieData.map((entry,index)=>(
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip/>
              <Legend verticalAlign="bottom"/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="chart-box">
          <h3>Monthly Income vs Expense</h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" interval={0} />
              <YAxis/>
              <Tooltip/>
              <Legend/>

              <Bar dataKey="income" fill="#48bb78"/>
              <Bar dataKey="expense" fill="#f56565"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 🤖 AI SECTION */}
      <div className="ai-card">

        <h2>🤖 AI Financial Insights</h2>

        <button
          className="ai-btn"
          onClick={handleAI}
        >
          Analyze My Spending
        </button>

        {aiMessage && (
          <p className="ai-result">
            {aiMessage}
          </p>
        )}

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/budget.css";

function Budget() {

  const [budget, setBudget] = useState("");
  const [storedBudget, setStoredBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.error("No user found in localStorage");
        return;
      }

      console.log("Fetching budget for user:", user.id);

      // Fetch budget and expense data
      const [budgetResponse, expenseResponse] = await Promise.all([
        fetch(`/api/budget/${user.id}`),
        fetch(`/api/expense/${user.id}`)
      ]);

      const budgetData = budgetResponse.ok ? await budgetResponse.json() : { budget: null };
      const expenseData = expenseResponse.ok ? await expenseResponse.json() : { expenses: [] };

      console.log("Budget data:", budgetData);
      console.log("Expense data:", expenseData);

      if (budgetData.budget) {
        setStoredBudget(budgetData.budget.amount);
      }

      const expenses = expenseData.expenses || [];
      const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      setSpent(totalExpense);

    } catch (error) {
      console.error("Error fetching budget data:", error);
    }
  };

  const saveBudget = async () => {
    if (!budget) return;

    setLoading(true);

    try {
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      console.log("Saving budget for user:", user.id);
      console.log("Budget amount:", budget);

      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(budget)
        }),
      });

      console.log("Budget API response status:", response.status);
      const data = await response.json();
      console.log("Budget API response data:", data);

      if (data.success) {
        setStoredBudget(parseFloat(budget));
        setBudget("");
        alert("Budget saved successfully! 🎉");
      } else {
        alert(data.message || "Failed to save budget");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const remaining = storedBudget - spent;

  const exceeded = spent > storedBudget;

  const percentage =
    storedBudget > 0
      ? Math.min((spent / storedBudget) * 100, 100)
      : 0;

  return (

    <DashboardLayout>

      <div className="budget-wrapper">

        <h2 className="page-title">Budget</h2>

        {/* BUDGET INPUT */}

        <div className="budget-card">

          <h3>Set Monthly Budget</h3>

          <input
            type="number"
            placeholder="Enter budget amount"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value)
            }
          />

          <button onClick={saveBudget} disabled={loading}>
            {loading ? "Saving..." : "Save Budget"}
          </button>

        </div>

        {/* BUDGET STATS */}

        <div className="budget-stats">

          <div className="stat-card">
            <p>Budget</p>
            <h3>₹{storedBudget}</h3>
          </div>

          <div className="stat-card">
            <p>Spent</p>
            <h3>₹{spent}</h3>
          </div>

          <div className="stat-card">
            <p>Remaining</p>

            {/* Remaining red if negative */}

            <h3
              style={{
                color:
                  remaining < 0
                    ? "#c62828"
                    : "#4f3689"
              }}
            >
              ₹{remaining}
            </h3>

          </div>

        </div>

        {/* PROGRESS BAR */}

        <div className="budget-progress">

          <h3>Budget Usage</h3>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${percentage}%`
              }}
            ></div>

          </div>

          <p>{percentage.toFixed(0)}% used</p>

        </div>

        {/* WARNING */}

        {exceeded && (

          <div className="budget-warning">

            ⚠ Budget limit exceeded!  
            You spent ₹{spent} which is above your budget.

          </div>

        )}

      </div>

    </DashboardLayout>

  );
}

export default Budget;
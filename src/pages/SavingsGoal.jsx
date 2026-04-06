import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/savings.css";

function SavingsGoal() {

  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);

  const [storedGoals, setStoredGoals] = useState([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.error("No user found in localStorage");
        return;
      }

      console.log("Fetching goals for user:", user.id);

      const response = await fetch(`/api/goal/${user.id}`);
      const data = response.ok ? await response.json() : { goals: [] };

      console.log("Goals data:", data);

      setStoredGoals(data.goals || []);

    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const saveGoal = async () => {
    if (!goalName || !target) return;

    setLoading(true);

    try {
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      console.log("Saving goal for user:", user.id);
      console.log("Goal data:", { goalName, target, saved });

      const response = await fetch("/api/goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          goalName,
          target: parseFloat(target),
          saved: parseFloat(saved) || 0
        }),
      });

      console.log("Goal API response status:", response.status);
      const data = await response.json();
      console.log("Goal API response data:", data);

      if (data.success) {
        setGoalName("");
        setTarget("");
        setSaved("");
        alert("Goal created successfully! 🎉");
        fetchGoals(); // Refresh goals list
      } else {
        alert(data.message || "Failed to create goal");
      }
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total progress across all goals
  const totalTarget = storedGoals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSaved = storedGoals.reduce((sum, goal) => sum + goal.saved, 0);
  const percentage = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <DashboardLayout>

      <div className="goal-wrapper">

        <h2 className="page-title">Savings Goal</h2>

        {/* GOAL FORM */}

        <div className="goal-card">

          <input
            placeholder="Goal name (Laptop, Trip...)"
            value={goalName}
            onChange={(e) =>
              setGoalName(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Target amount"
            value={target}
            onChange={(e) =>
              setTarget(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Amount saved"
            value={saved}
            onChange={(e) =>
              setSaved(e.target.value)
            }
          />

          <button onClick={saveGoal} disabled={loading}>
            {loading ? "Saving..." : "Save Goal"}
          </button>

        </div>


        {/* GOAL PROGRESS */}

        {storedGoals.length > 0 && (
          <div className="goals-container">
            <h3>Your Savings Goals</h3>
            {storedGoals.map((goal, index) => (
              <div key={goal._id} className="goal-progress">
                <h4>{goal.goalName}</h4>
                
                {/* INFO BOXES */}
                <div className="goal-info">
                  <div className="goal-box">
                    Saved ₹{goal.saved}
                  </div>
                  <div className="goal-box">
                    Target ₹{goal.target}
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0}%`
                    }}
                  ></div>
                </div>
                <p>{goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100).toFixed(0) : 0}% completed</p>
              </div>
            ))}
            
            {/* Overall Progress */}
            <div className="overall-progress">
              <h3>Overall Progress</h3>
              <div className="goal-info">
                <div className="goal-box">
                  Total Saved ₹{totalSaved}
                </div>
                <div className="goal-box">
                  Total Target ₹{totalTarget}
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${percentage}%`
                  }}
                ></div>
              </div>
              <p>{percentage.toFixed(0)}% completed</p>
            </div>
          </div>
        )}

      </div>

    </DashboardLayout>
  );
}

export default SavingsGoal;
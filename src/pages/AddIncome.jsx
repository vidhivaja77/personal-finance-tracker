import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/addIncome.css";

function AddIncome() {

  const [form, setForm] = useState({
    amount: "",
    source: "",
    date: "",
    note: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.amount) {
      newErrors.amount = "Amount is required";
    } else if (form.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!form.source) {
      newErrors.source = "Please select income source";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setErrors({ submit: "Please login first" });
        setLoading(false);
        return;
      }

      console.log("Adding income for user:", user.id);
      console.log("Form data:", form);

      const response = await fetch("/api/income/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(form.amount),
          source: form.source,
          date: form.date,
          note: form.note
        }),
      });

      console.log("Income API response status:", response.status);
      const data = await response.json();
      console.log("Income API response data:", data);

      if (data.success) {
        // Reset form
        setForm({
          amount: "",
          source: "",
          date: "",
          note: ""
        });

        setErrors({});
        alert("Income added successfully! 🎉");
        
        // Refresh transactions list if function exists
        if (window.refreshTransactions) {
          window.refreshTransactions();
        }
        
        // Refresh dashboard if function exists
        if (window.refreshDashboard) {
          window.refreshDashboard();
        }
        
        // Refresh report if function exists
        if (window.refreshReport) {
          window.refreshReport();
        }
      } else {
        setErrors({ submit: data.message || "Failed to add income" });
      }
    } catch (error) {
      console.error("Error adding income:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="add-income-wrapper">

        <h2 className="page-title">
          Add Income
        </h2>

        <div className="income-card">

          <form onSubmit={handleSubmit}>

            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={form.amount}
              onChange={handleChange}
            />
            {errors.amount && (
              <p className="form-error">{errors.amount}</p>
            )}

            <label>Source</label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
            >
              <option value="">Select Source</option>
              <option>Salary</option>
              <option>Freelance</option>
              <option>Business</option>
              <option>Investment</option>
            </select>
            {errors.source && (
              <p className="form-error">{errors.source}</p>
            )}

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && (
              <p className="form-error">{errors.date}</p>
            )}

            <label>Note</label>
            <textarea
              name="note"
              placeholder="Optional note"
              value={form.note}
              onChange={handleChange}
            />

            {errors.submit && (
              <p className="form-error">{errors.submit}</p>
            )}

            <button className="save-btn" disabled={loading}>
              {loading ? "Adding..." : "Save Income"}
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AddIncome;
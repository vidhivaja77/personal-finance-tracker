import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/addExpense.css";

function AddExpense() {

  const [form, setForm] = useState({
    amount: "",
    category: "",
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

    if (!form.category) {
      newErrors.category = "Please select category";
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

      console.log("Adding expense for user:", user.id);
      console.log("Form data:", form);

      const response = await fetch("/api/expense/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(form.amount),
          category: form.category,
          date: form.date,
          note: form.note
        }),
      });

      console.log("Expense API response status:", response.status);
      const data = await response.json();
      console.log("Expense API response data:", data);

      if (data.success) {
        // Reset form
        setForm({
          amount: "",
          category: "",
          date: "",
          note: ""
        });

        setErrors({});
        alert("Expense added successfully! 🎉");
        
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
        setErrors({ submit: data.message || "Failed to add expense" });
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="add-expense-wrapper">

        <h2 className="page-title">
          Add Expense
        </h2>

        <div className="expense-card">

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

            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
            {errors.category && (
              <p className="form-error">{errors.category}</p>
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
              {loading ? "Adding..." : "Save Expense"}
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AddExpense;
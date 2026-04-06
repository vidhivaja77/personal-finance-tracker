import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EditModal from "../components/EditModal";
import "../styles/transactions.css";
import "../styles/editModal.css";

function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Edit modal state
  const [editModal, setEditModal] = useState({
    isOpen: false,
    transaction: null
  });
  const [editLoading, setEditLoading] = useState(false);

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Fetching transactions for user:", user.id);

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

      // Combine and add type field
      const incomeWithTypes = incomeArray.map(item => ({
        ...item,
        type: "income"
      }));

      const expenseWithTypes = expenseArray.map(item => ({
        ...item,
        type: "expense"
      }));

      // Combine all transactions
      const allTransactions = [...incomeWithTypes, ...expenseWithTypes];
      
      // Sort by date (latest first)
      const sortedTransactions = allTransactions.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      console.log("Combined transactions:", sortedTransactions);

      setTransactions(sortedTransactions);
      setFiltered(sortedTransactions);

    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Refresh function for external calls
  window.refreshTransactions = fetchTransactions;




  /* FILTER FUNCTION */

  const applyFilters = () => {

    let data = [...transactions];

    /* SEARCH */

    if(search){

      data = data.filter(item =>
        (item.category || item.source)
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    /* TYPE FILTER */

    if(typeFilter !== "all"){

      data = data.filter(
        item => item.type === typeFilter
      );

    }

    /* DATE FILTER */

    if(startDate && endDate){

      data = data.filter(item => {

        const d = new Date(item.date);

        return (
          d >= new Date(startDate) &&
          d <= new Date(endDate)
        );

      });

    }

    setFiltered(data);

  };



  useEffect(()=>{
    applyFilters();
  },[search,typeFilter,startDate,endDate]);




  /* DELETE */

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      console.log("Deleting transaction:", item);

      let apiUrl;
      if (item.type === "income") {
        apiUrl = `/api/income/${item._id}`;
      } else {
        apiUrl = `/api/expense/${item._id}`;
      }

      const response = await fetch(apiUrl, {
        method: "DELETE"
      });

      console.log("Delete API response status:", response.status);
      
      if (response.ok) {
        console.log("Transaction deleted successfully");
        // Refresh transactions list
        fetchTransactions();
        
        // Refresh dashboard if function exists
        if (window.refreshDashboard) {
          window.refreshDashboard();
        }
        
        // Refresh report if function exists
        if (window.refreshReport) {
          window.refreshReport();
        }
      } else {
        const errorData = await response.json();
        console.error("Delete failed:", errorData);
        alert("Failed to delete transaction: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Network error. Please try again.");
    }
  };



  /* EDIT FUNCTIONALITY */

  const handleEdit = (item) => {
    setEditModal({
      isOpen: true,
      transaction: item
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({
      isOpen: false,
      transaction: null
    });
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      setEditLoading(true);
      
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please log in to edit transactions");
        return;
      }

      const endpoint = editModal.transaction.type === 'income' 
        ? `/api/income/${editModal.transaction._id || editModal.transaction.id}`
        : `/api/expense/${editModal.transaction._id || editModal.transaction.id}`;

      console.log("Updating transaction:", { endpoint, updatedData });

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...updatedData,
          userId: user.id
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log("Transaction updated successfully:", data);
        alert(`${editModal.transaction.type === 'income' ? 'Income' : 'Expense'} updated successfully!`);
        
        // Close modal
        handleCloseEditModal();
        
        // Refresh transactions list
        fetchTransactions();
        
        // Refresh dashboard if function exists
        if (window.refreshDashboard) {
          window.refreshDashboard();
        }
        
        // Refresh report if function exists
        if (window.refreshReport) {
          window.refreshReport();
        }
      } else {
        alert(`Failed to update ${editModal.transaction.type}: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Network error. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };



  return (

    <DashboardLayout>

      <div className="transactions-wrapper">

        <h2 className="page-title">
          Transactions
        </h2>


        {/* FILTER UI */}

        <div className="filters">

          <input
            type="text"
            placeholder="Search category or source"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <select
            value={typeFilter}
            onChange={(e)=>setTypeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e)=>setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e)=>setEndDate(e.target.value)}
          />

        </div>



        {/* TABLE */}

        {loading ? (
          <div className="loading-container">
            <p>Loading transactions...</p>
          </div>
        ) : (
          <table className="transactions-table">

            <thead>

              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Category / Source</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-transactions">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  return (
                    <tr key={item._id || item.id}>

                      <td>
                        <span 
                          className={item.type === 'income' ? 'income-text' : 'expense-text'}
                        >
                          {item.type}
                        </span>
                      </td>

                      <td>₹{item.amount}</td>

                      <td>
                        {item.category || item.source}
                      </td>

                      <td>{new Date(item.date).toLocaleDateString()}</td>

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>
        )}

      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
        transaction={editModal.transaction}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

    </DashboardLayout>

  );

}

export default Transactions;
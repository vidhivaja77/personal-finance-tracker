import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/report.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Report() {

  const [monthlyData, setMonthlyData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [topCategory, setTopCategory] = useState("None");
  const [loading, setLoading] = useState(true);

  // Fetch data from API and calculate monthly summary
  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Fetching report data for user:", user.id);

      // Fetch income and expense data
      const [incomeResponse, expenseResponse] = await Promise.all([
        fetch(`/api/income/${user.id}`),
        fetch(`/api/expense/${user.id}`)
      ]);

      const incomeData = incomeResponse.ok ? await incomeResponse.json() : { income: [] };
      const expenseData = expenseResponse.ok ? await expenseResponse.json() : { expenses: [] };

      const incomes = incomeData.income || [];
      const expenses = expenseData.expenses || [];

      console.log("Income data:", incomes);
      console.log("Expense data:", expenses);

      // Verify date formats
      console.log("Sample income dates:", incomes.map(i => i.date));
      console.log("Sample expense dates:", expenses.map(e => e.date));

      // Initialize monthly data array
      const months = [
        "Jan","Feb","Mar","Apr",
        "May","Jun","Jul","Aug",
        "Sep","Oct","Nov","Dec"
      ];

      const currentYear = new Date().getFullYear();

      // Create array of 12 months with income and expense initialized to 0
      const monthlySummary = Array(12).fill().map((_, index) => ({
        month: months[index],
        income: 0,
        expense: 0,
        balance: 0
      }));

      console.log("Initial monthly summary:", monthlySummary);

      // Process income data
      incomes.forEach(item => {
        try {
          const date = new Date(item.date);
          console.log("Processing income date:", item.date, "parsed as:", date);
          
          const month = date.getMonth(); // 0 = Jan, 1 = Feb, etc.
          const year = date.getFullYear();
          
          if (year === currentYear && month >= 0 && month <= 11) {
            monthlySummary[month].income += Number(item.amount);
            console.log(`Added income ₹${item.amount} to month ${month} (${months[month]})`);
          }
        } catch (error) {
          console.error("Error parsing income date:", item.date, error);
        }
      });

      // Process expense data
      expenses.forEach(item => {
        try {
          const date = new Date(item.date);
          console.log("Processing expense date:", item.date, "parsed as:", date);
          
          const month = date.getMonth(); // 0 = Jan, 1 = Feb, etc.
          const year = date.getFullYear();
          
          if (year === currentYear && month >= 0 && month <= 11) {
            monthlySummary[month].expense += Number(item.amount);
            console.log(`Added expense ₹${item.amount} to month ${month} (${months[month]})`);
          }
        } catch (error) {
          console.error("Error parsing expense date:", item.date, error);
        }
      });

      // Calculate balance for each month
      monthlySummary.forEach(month => {
        month.balance = month.income - month.expense;
      });

      console.log("Final monthly summary:", monthlySummary);

      setMonthlyData(monthlySummary);

      // Calculate totals
      const totalInc = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
      const totalExp = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

      console.log("Total income:", totalInc);
      console.log("Total expense:", totalExp);

      setTotalIncome(totalInc);
      setTotalExpense(totalExp);

      // Find top spending category
      const categoryMap = {};
      expenses.forEach(item => {
        const cat = item.category;
        if (!categoryMap[cat]) categoryMap[cat] = 0;
        categoryMap[cat] += Number(item.amount);
      });

      console.log("Category map:", categoryMap);

      const categories = Object.keys(categoryMap);
      if (categories.length > 0) {
        const top = categories.reduce((a, b) => 
          categoryMap[a] > categoryMap[b] ? a : b
        );
        setTopCategory(top);
        console.log("Top category:", top);
      }

    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Refresh function for external calls
  window.refreshReport = fetchReportData;


  /* DOWNLOAD PDF */

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Financial Report", 14, 20);

    doc.setFontSize(12);

    doc.text(
      `Total Income: Rs ${totalIncome.toLocaleString()}`,
      14,
      30
    );

    doc.text(
      `Total Expense: Rs ${totalExpense.toLocaleString()}`,
      14,
      38
    );

    doc.text(
      `Net Savings: Rs ${(totalIncome-totalExpense).toLocaleString()}`,
      14,
      46
    );

    const tableData = monthlyData.map(item => [
      item.month,
      `Rs ${item.income.toLocaleString()}`,
      `Rs ${item.expense.toLocaleString()}`,
      `Rs ${item.balance.toLocaleString()}`
    ]);

    autoTable(doc,{
      startY:55,
      head:[["Month","Income","Expense","Balance"]],
      body:tableData
    });

    doc.save("Financial_Report.pdf");

  };


  return (

    <DashboardLayout>

      <div className="report-wrapper">

        <div className="report-header">

          <h2 className="page-title">
            Financial Report
          </h2>

          <button
            className="download-btn"
            onClick={downloadPDF}
            disabled={loading}
          >
            {loading ? "Loading..." : "Download PDF"}
          </button>

        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading financial report...</p>
          </div>
        ) : (
          <>
            <div className="report-cards">

              <div className="report-card income-card">
                <h3>Total Income</h3>
                <p>₹{totalIncome.toLocaleString()}</p>
              </div>

              <div className="report-card expense-card">
                <h3>Total Expense</h3>
                <p>₹{totalExpense.toLocaleString()}</p>
              </div>

              <div className="report-card balance-card">
                <h3>Net Savings</h3>
                <p>₹{(totalIncome-totalExpense).toLocaleString()}</p>
              </div>

            </div>


            <div className="report-table">

              <h3>
                Monthly Financial Summary ({new Date().getFullYear()})
              </h3>

              <table>

                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Expense</th>
                    <th>Balance</th>
                  </tr>
                </thead>

                <tbody>

                  {monthlyData.map((item,index)=>(

                    <tr key={index}>

                      <td>{item.month}</td>

                      <td className="income-cell">
                        ₹{item.income.toLocaleString()}
                      </td>

                      <td className="expense-cell">
                        ₹{item.expense.toLocaleString()}
                      </td>

                      <td className="balance-cell">
                        ₹{item.balance.toLocaleString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            <div className="report-insight">

              <h3>Spending Insight</h3>

              <p>
                You spent the most on
                <b> {topCategory} </b>
                this year.
              </p>

            </div>
          </>
        )}

      </div>

    </DashboardLayout>

  );
}

export default Report;
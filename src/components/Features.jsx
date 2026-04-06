import { useState } from "react";
import "../styles/features.css";

/* IMAGES */
import f1 from "../assets/feature1.png";
import f2 from "../assets/feature2.png";
import f3 from "../assets/feature3.png";
import f4 from "../assets/feature4.png";
import f5 from "../assets/feature5.png";
import f6 from "../assets/feature6.png";
import f7 from "../assets/feature7.png";
import f8 from "../assets/feature8.png";

function Features() {

  const [showMore, setShowMore] = useState(false);

  return (

    <section className="features">

      <h2>Smart financial tools</h2>

      <p className="features-sub">
        Take charge of your finances with these powerful features.
      </p>

      {/* TOP FEATURES */}
      <div className="features-grid">

        <div className="feature-card">
          <img src={f1} alt="" />
          <h3>Track Income & Expenses</h3>
          <p>Easily manage your daily transactions.</p>
        </div>

        <div className="feature-card">
          <img src={f2} alt="" />
          <h3>Set Budgets</h3>
          <p>Control your monthly spending smartly.</p>
        </div>

        <div className="feature-card">
          <img src={f3} alt="" />
          <h3>Monitor Savings Goals</h3>
          <p>Track your progress easily.</p>
        </div>

        <div className="feature-card">
          <img src={f4} alt="" />
          <h3>Analyze Reports</h3>
          <p>Get insights with reports.</p>
        </div>

      </div>

      {/* BUTTON */}
      <button
        className="explore-btn"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Hide Features" : "Explore Features"}
      </button>

      {/* EXTRA FEATURES */}
      {showMore && (
        <div className="extra-features">

          <div className="feature-card">
            <img src={f5} alt="" />
            <h3>Filter Transactions</h3>
            <p>Search by date, category, or type.</p>
          </div>

          <div className="feature-card">
            <img src={f6} alt="" />
            <h3>PDF Reports</h3>
            <p>Download financial reports easily.</p>
          </div>

          <div className="feature-card">
            <img src={f7} alt="" />
            <h3>Charts & Graphs</h3>
            <p>Visualize income and expenses clearly.</p>
          </div>

          <div className="feature-card">
            <img src={f8} alt="" />
            <h3>Secure Login</h3>
            <p>Your data stays safe and private.</p>
          </div>

        </div>
      )}

    </section>
  );
}

export default Features;
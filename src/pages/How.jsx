import "../styles/howw.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

import moneyImg from "../assets/money.png";
import teamImg from "../assets/team.png";
import goalImg from "../assets/goal.png";

function How() {
  const navigate = useNavigate();

  return (
    <div className="how-page">

      {/* HERO */}
      <section className="how-hero">
        <div className="container">

          <div className="hero-left">
            <h1>How It Works</h1>
            

            <h2>No more surprises</h2>
            <p>
              Track your income and expenses easily. Know exactly where your
              money goes every month and avoid unexpected bills.
            </p>
          </div>

          <div className="hero-right">
            <img src={moneyImg} alt="money" />
          </div>

        </div>
      </section>

      {/* SECTION 2 */}
      <section className="how-section">
        <div className="container">

          <div className="section-left">
            <img src={teamImg} alt="team" />
          </div>

          <div className="section-right">
            <h2>Stay on track</h2>
            <p>
              Set budgets and monitor your spending. Stay consistent and
              manage your finances with confidence.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3 */}
      <section className="how-section">
        <div className="container reverse">

          <div className="section-left">
            <img src={goalImg} alt="goal" />
          </div>

          <div className="section-right">
            <h2>Achieve your goals</h2>
            <p>
              Save money, analyze reports, and grow your financial future
              with smart insights.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <div className="how-cta">
        <h2>Start your journey today</h2>
        <button onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default How;
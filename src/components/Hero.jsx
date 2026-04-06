import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

function Hero() {

  const navigate = useNavigate();

  return (

    <section className="hero">

      <div className="hero-content">

        <h1>Budget with a why</h1>

        <p className="subtitle">
          Spend, save, and give toward what’s important in life
        </p>

        <button
          className="cta-btn"
          onClick={() => navigate("/login")}
        >
          CREATE YOUR FINTRACK
        </button>

      </div>

    </section>

  );
}

export default Hero;
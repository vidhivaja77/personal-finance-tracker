import "../styles/navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          <img src={logo} alt="Fintrack Logo" className="logo-img" />
          <span className="logo-text">Fintrack</span>
        </Link>

        {/* 🔥 NAV LINKS (ROUTING FIXED) */}
        <ul className="nav-links">
          <li>
            <Link to="/how">How It Works</Link>
          </li>
          <li>
            <Link to="/features">What You Get</Link>
          </li>
      
        </ul>

        {/* BUTTONS */}
        <div className="nav-buttons">
          <Link to="/login" className="login-btn">Log In</Link>
          <Link to="/register" className="signup-btn">Sign Up</Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import "../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    // demo reset logic
    setMessage("Password reset link sent to your email ✅");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your email to receive reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">

          <label>Email</label>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
            />
          </div>

          {message && <p className="info">{message}</p>}

          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>
        </form>

        <p className="auth-switch">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
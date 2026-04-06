import "../styles/footer.css";
import footerImg from "../assets/footer-illustration.png"; // add your illustration here

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">
        <h2>Fintrack</h2>
        <p>
          Take control of your finances, track spending,
          and grow your savings.
        </p>
      </div>

      <div className="footer-content">

        {/* LEFT */}
        <div className="footer-brand">
          <h3>Fintrack</h3>
          <p>
            A personal finance app for tracking income,
            expenses, and savings goals. Manage your finances
            easily with secure and smart tools.
          </p>

          <div className="socials">
            <span>💜</span>
            <span>💜</span>
            <span>💜</span>
          </div>
        </div>

        {/* COLUMN 1 */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li>Home</li>
            <li>How It Works</li>
            <li>What You Get</li>
            <li>The Fintrack Way</li>
            <li>Features</li>
            <li>About Us</li>
          </ul>
        </div>

        {/* COLUMN 2 */}
        <div className="footer-col">
          <h4>Get Started</h4>
          <ul>
            <li>Sign Up</li>
            <li>Log In</li>
            <li>Add Income</li>
            <li>Set Budgets</li>
            <li>Monitor Goals</li>
            <li>View Reports</li>
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className="footer-col">
          <h4>Get Help</h4>
          <ul>
            <li>User Guide</li>
            <li>FAQs</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div className="footer-img">
          <img src={footerImg} alt="illustration" />
        </div>

      </div>
    </footer>
  );
}

export default Footer;
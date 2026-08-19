function AppFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="footer-brand-block">
        <strong>PCOSense</strong>

        <p>
          © 2026 Manasvi Naik, Menaka Jadhav,
          Mehek Abhyankar and Vaishnavi Paliwal.
          All rights reserved.
        </p>
      </div>

      <div className="footer-links">
        <button>Dashboard</button>
        <button>Predict PCOS</button>
        <button>Health Summary</button>
        <button>My Records</button>
        <button>About Us</button>
      </div>
    </footer>
  );
}

export default AppFooter;
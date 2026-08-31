import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import './Signup.css';


export default function Signup({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onSwitchToLogin,
  onSwitchToAboutUs,
  isLoading
}) {
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleSignupSubmit = (e) => {
  e.preventDefault();

  if (!name.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  onSubmit(e, name.trim());
};


  return (
    <div className="signup-wrapper">
      {/* TopNavBar */}
      <header className="signup-header">
        <div className="signup-header-content">
          <div className="signup-logo">
            <span className="signup-logo-text">PCOSense</span>
          </div>
          <nav className="signup-nav-center">
            <button onClick={() => onSwitchToAboutUs()} className="signup-nav-btn">About Us</button>
          </nav>
          <div className="signup-nav-right">
            <button className="signup-login-btn" onClick={onSwitchToLogin}>Log In</button>
          </div>
        </div>
      </header>


      {/* Main Content: Split Screen Layout */}
      <main className="signup-main">
        {/* Left Column: Branding & Illustration */}
        <section className="signup-left-section">
          <div className="signup-pattern"></div>
          <div className="signup-left-content">
            <div className="signup-image-box">
              <img
                alt="Professional flat illustration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuZ6HptpSedbGjgvjnI3eMF9qFhb643doUIXU28s7FwoYH4CB3uyxce6vsAhJrCaMDW7mAK5-8hnoFqwv0DoyJvNp5rDOzK3qysRpOvNS_uFwpRTmtlvuvT_5VDQPeF4frfvDA5DwLod7rDbkGqim2Wx3yoPhbHAmMrkmPDdYuDwy4f6VHn5t0NR-7OHg57ri3Wu3ZMJCxNpDm0uFwd3ozraOu4inJZT8YkCLd5nBR7HIPyH4I5yHK5jF-rX1j6pQr2xalgllvaw"
              />
            </div>
            <h1 className="signup-title">
              Join the future of hormonal health.
            </h1>
            <p className="signup-subtitle">
              Empowering women with AI-driven insights to manage PCOS with confidence, clarity, and compassion.
            </p>
            <div className="signup-badges">
              <div className="signup-badge">
                <div className="signup-badge-icon">
                  <ShieldCheck size={20} />
                </div>
                <span className="signup-badge-text">HIPAA Compliant</span>
              </div>
              <div className="signup-badge">
                <div className="signup-badge-icon">
                  <FileText size={20} />
                </div>
                <span className="signup-badge-text">Evidence-Based</span>
              </div>
            </div>
          </div>
        </section>


        {/* Right Column: Registration Form */}
        <section className="signup-right-section">
          <div className="signup-form-container">
            <div className="signup-form-header">
              <h2>Create your account</h2>
              <p>Start your personalized health journey today.</p>
            </div>
           
            <form className="signup-form" onSubmit={handleSignupSubmit}>
              <div className="signup-input-group">
                <label className="signup-label" htmlFor="name">Full Name</label>
                <input
                  className="signup-input"
                  id="name"
                  placeholder="Enter your full name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="signup-input-group">
                <label className="signup-label" htmlFor="email">Email Address</label>
                <input
                  className="signup-input"
                  id="email"
                  placeholder="example@health.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="signup-input-group">
                <label className="signup-label" htmlFor="password">Password</label>
                <div className="signup-password-container">
                  <input
                    className="signup-input"
                    id="password"
                    placeholder="At least 8 characters"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="signup-eye-btn"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="signup-input-group">
                <label className="signup-label" htmlFor="confirm-password">Confirm Password</label>
                <input
                  className="signup-input"
                  id="confirm-password"
                  placeholder="Repeat your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="signup-submit-wrapper">
                <button
                  className="signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>


            <div className="signup-bottom-text">
              <p className="signup-terms">
                By signing up, you agree to our
                <a href="#"> Terms of Service</a> and
                <a href="#"> Privacy Policy</a>.
              </p>
              <div className="signup-divider"></div>
              <p className="signup-login-prompt">
                Already have an account?{' '}
                <button
                  className="signup-login-prompt-btn"
                  onClick={onSwitchToLogin}
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>


      {/* Footer Component */}
      <footer className="signup-footer">
        <div className="signup-footer-content">
          <div className="signup-footer-left">
            <span>PCOSense</span>
            <p>
              © 2024 PCOSense. Clinical decision support only. Not a substitute for professional medical advice.
            </p>
          </div>
          <div className="signup-footer-right">
            <a className="signup-footer-link" href="#">Privacy Policy</a>
            <a className="signup-footer-link" href="#">Terms of Service</a>
            <a className="signup-footer-link" href="#">Clinical Guidelines</a>
            <a className="signup-footer-link" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
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

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // We can pass name as well if the backend requires it, but for now just passing e to AuthPage's handler
    onSubmit(e);
  };

  return (
    <div className="signup-wrapper">
      {/* TopNavBar */}
      <header className="signup-header">
        <div className="signup-header-content">
          <div className="signup-logo">
            <span>PCOSense</span>
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
      <main className="signup-main-content">
        {/* Left Column: Branding & Illustration */}
        <section className="signup-left-panel">
          <div className="signup-pattern"></div>
          <div className="signup-left-content">
            <div className="signup-image-container">
              <img 
                alt="Professional flat illustration" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuZ6HptpSedbGjgvjnI3eMF9qFhb643doUIXU28s7FwoYH4CB3uyxce6vsAhJrCaMDW7mAK5-8hnoFqwv0DoyJvNp5rDOzK3qysRpOvNS_uFwpRTmtlvuvT_5VDQPeF4frfvDA5DwLod7rDbkGqim2Wx3yoPhbHAmMrkmPDdYuDwy4f6VHn5t0NR-7OHg57ri3Wu3ZMJCxNpDm0uFwd3ozraOu4inJZT8YkCLd5nBR7HIPyH4I5yHK5jF-rX1j6pQr2xalgllvaw"
              />
            </div>
            <h1>
              Join the future of hormonal health.
            </h1>
            <p>
              Empowering women with AI-driven insights to manage PCOS with confidence, clarity, and compassion.
            </p>
            <div className="signup-badges">
              <div className="signup-badge">
                <span className="material-symbols-outlined">verified_user</span>
                <span>HIPAA Compliant</span>
              </div>
              <div className="signup-badge">
                <span className="material-symbols-outlined">clinical_notes</span>
                <span>Evidence-Based</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Registration Form */}
        <section className="signup-right-panel">
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="signup-eye-btn" 
                    type="button"
                    onClick={() => {
                      const passInput = document.getElementById('password');
                      if (passInput.type === 'password') {
                        passInput.type = 'text';
                      } else {
                        passInput.type = 'password';
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">visibility</span>
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
              <div className="signup-submit-container">
                <button 
                  className="signup-submit-btn" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined signup-spinner">sync</span> Processing...
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="signup-footer-text-container">
              <p className="signup-terms-text">
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
          <div className="signup-footer-brand">
            <span>PCOSense</span>
            <p>
              © 2024 PCOSense. Clinical decision support only. Not a substitute for professional medical advice.
            </p>
          </div>
          <div className="signup-footer-links">
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
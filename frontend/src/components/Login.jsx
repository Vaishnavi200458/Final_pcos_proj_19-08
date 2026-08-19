import React from 'react';
import './Login.css';

export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onSwitchToSignup,
  onSwitchToAboutUs,
  isLoading
}) {
  return (
    <div className="login-wrapper">
      {/* TopNavBar */}
      <header className="login-header">
        <div className="login-header-content">
          <div className="login-logo">
            <span>PCOSense</span>
          </div>
          <nav className="login-nav-center">
            <button onClick={() => onSwitchToAboutUs()} className="login-nav-btn">About Us</button>
          </nav>
          <div className="login-nav-right">
            <button className="login-signup-btn" onClick={onSwitchToSignup}>Sign Up</button>
          </div>
        </div>
      </header>

      <main className="login-main-content">
        {/* Left Column: Illustration & Tagline */}
        <section className="login-left-panel">
          <div className="login-ambient-glow"></div>
          <div className="login-blur-circle-1"></div>
          <div className="login-blur-circle-2"></div>
          <div className="login-left-content">
            <div className="login-image-container">
              <img 
                alt="Medical lifestyle illustration" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM24YRgRnceMFaQLrh-me61lhbnOYCF5yb6gLafG03iNNELI7TuLbxsstkbvwRtNXPkNblToNMN9FU88xx09fXfx1RQNtmszVYbK-wI5enYJtUOwvyuQXxFJprKcdtMbn2rotdJlPgLrpD5Z7lNsPBakJ5SUQ4y34rA6UI72OBkrYYucDv99yCyE-MoNDRAlGqUJkQ5YUyOclfQt-R6GaGVNVFE7sWsLXKlt68lvaKuptDiQiyd40IQzXCDeANg5dhmfix9LSGgA" 
              />
            </div>
            <div className="login-left-text">
              <h2>PCOSense</h2>
              <p>Empowering your hormonal health journey. Personalized insights and community support for managing PCOS with confidence and clarity.</p>
            </div>
          </div>
        </section>

        {/* Right Column: Login Form */}
        <section className="login-right-panel">
          <div className="login-form-container">
            <div className="login-mobile-logo">
              <span>PCOSense</span>
            </div>
            
            <div className="login-form-header">
              <h1>Welcome Back</h1>
              <p>Please enter your details to sign in.</p>
            </div>

            <form className="login-form" onSubmit={onSubmit}>
              <div className="login-input-group">
                <label className="login-label" htmlFor="email">Email Address</label>
                <input 
                  className="login-input" 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-input-group">
                <label className="login-label" htmlFor="password">Password</label>
                <div className="login-password-container">
                  <input 
                    className="login-input" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="login-eye-btn" 
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
              <div className="login-forgot-container">
                <a className="login-forgot-link" href="#">Forgot Password?</a>
              </div>
              <button 
                className="login-submit-btn" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined login-spinner">sync</span> Processing...
                  </>
                ) : "Log In"}
              </button>
            </form>

            <p className="login-signup-prompt">
              Don't have an account?{' '}
              <button 
                type="button" 
                className="login-signup-prompt-btn" 
                onClick={onSwitchToSignup}
              >
                Sign up
              </button>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="login-footer">
          <div className="login-footer-content">
            <p className="login-footer-text">© 2024 PCOSense. Clinical reliability for hormonal health.</p>
            <div className="login-footer-links">
              <a className="login-footer-link" href="#">Privacy Policy</a>
              <a className="login-footer-link" href="#">Contact Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="login-wrapper">
      {/* TopNavBar */}
      <header className="login-header">
        <div className="login-header-content">
          <div className="login-logo">
            <span className="login-logo-text">PCOSense</span>
          </div>
          <nav className="login-nav-center">
            <button onClick={() => onSwitchToAboutUs()} className="login-nav-btn">About Us</button>
          </nav>
          <div className="login-nav-right">
            <button className="login-signup-btn" onClick={onSwitchToSignup}>Sign Up</button>
          </div>
        </div>
      </header>


      <main className="login-main">
        {/* Left Column: Illustration & Tagline */}
        <section className="login-left-section">
          <div className="ambient-glow absolute top-0 left-0 w-full h-full pointer-events-none"></div>
          <div className="login-blur-1"></div>
          <div className="login-blur-2"></div>
          <div className="login-left-content">
            <div className="login-image-box">
              <img
                alt="Medical lifestyle illustration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM24YRgRnceMFaQLrh-me61lhbnOYCF5yb6gLafG03iNNELI7TuLbxsstkbvwRtNXPkNblToNMN9FU88xx09fXfx1RQNtmszVYbK-wI5enYJtUOwvyuQXxFJprKcdtMbn2rotdJlPgLrpD5Z7lNsPBakJ5SUQ4y34rA6UI72OBkrYYucDv99yCyE-MoNDRAlGqUJkQ5YUyOclfQt-R6GaGVNVFE7sWsLXKlt68lvaKuptDiQiyd40IQzXCDeANg5dhmfix9LSGgA"
              />
            </div>
            <div className="login-text-box">
              <h2>PCOSense</h2>
              <p>
                Empowering your hormonal health journey. Personalized insights and community support for managing PCOS with confidence and clarity.
              </p>
            </div>
          </div>
        </section>


        {/* Right Column: Login Form */}
        <section className="login-right-section">
          <div className="login-form-container">
            <div className="login-mobile-logo">
              <span className="login-logo-text">PCOSense</span>
            </div>
           
            <div className="login-welcome-box">
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="login-eye-btn"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                    
                </div>
              </div>
              <div className="login-forgot-box">
                <a className="login-forgot-link" href="#">Forgot Password?</a>
              </div>
              <button
                className="login-submit-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing...
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
              <a href="#">Privacy Policy</a>
              <a href="#">Contact Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

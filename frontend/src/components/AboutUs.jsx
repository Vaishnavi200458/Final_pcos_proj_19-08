import React from 'react';
import './AboutUs.css';

export default function AboutUs() {
  return (
    <div className="about-container">
      {/* TopNavBar */}
      <header className="about-header">
        <nav className="about-nav">
          <div className="about-logo">
            <span>PCOSense</span>
          </div>
          <div className="about-nav-links">
            <a className="about-nav-link" href="#">Dashboard</a>
            <a className="about-nav-link" href="#">Predict PCOS</a>
            <a className="about-nav-link" href="#">Health Summary</a>
            <a className="about-nav-link" href="#">My Records</a>
            <a className="about-nav-link about-nav-link-active" href="#">About Us</a>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <button className="material-symbols-outlined about-icon-btn">notifications</button>
          </div>
        </nav>
      </header>

      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-title-container" style={{maxWidth: '896px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10}}>
            <h1 className="about-hero-title">Meet the Team</h1>
            <p className="about-hero-subtitle">We're a passionate team of medical professionals and technologists dedicated to transforming PCOS care through AI-driven insights.</p>
          </div>
        </section>

        {/* Mission/Values Section */}
        <section className="about-mission">
          <div className="about-grid-3">
            <div className="about-value-card">
              <div className="about-value-icon">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h3 className="about-value-title">Data-Driven</h3>
              <p className="about-value-desc">Leveraging advanced AI to uncover personalized insights and predictive health patterns.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <span className="material-symbols-outlined">favorite</span>
              </div>
              <h3 className="about-value-title">Empathetic Care</h3>
              <p className="about-value-desc">Designing solutions with deep understanding of the daily challenges faced by those with PCOS.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <span className="material-symbols-outlined">shield_lock</span>
              </div>
              <h3 className="about-value-title">Secure &amp; Private</h3>
              <p className="about-value-desc">Ensuring the highest standards of data security and patient confidentiality at all times.</p>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="about-team">
          <div className="about-grid-4">
            <div className="about-team-card">
              <div className="about-team-photo">
                <span className="material-symbols-outlined">person</span>
              </div>
              <h3 className="about-team-name">Manasvi Naik</h3>
              <p className="about-team-role">Computer Engineering Student</p>
              <p className="about-team-desc">Passionate about building AI-driven solutions for healthcare.</p>
            </div>
            
            <div className="about-team-card">
              <div className="about-team-photo">
                <span className="material-symbols-outlined">person</span>
              </div>
              <h3 className="about-team-name">Mehek Abhyankar</h3>
              <p className="about-team-role">Computer Engineering Student</p>
              <p className="about-team-desc">Passionate about building AI-driven solutions for healthcare.</p>
            </div>
            
            <div className="about-team-card">
              <div className="about-team-photo">
                <span className="material-symbols-outlined">person</span>
              </div>
              <h3 className="about-team-name">Menaka Jadhav</h3>
              <p className="about-team-role">Computer Engineering Student</p>
              <p className="about-team-desc">Passionate about building AI-driven solutions for healthcare.</p>
            </div>

            <div className="about-team-card">
              <div className="about-team-photo">
                <span className="material-symbols-outlined">person</span>
              </div>
              <h3 className="about-team-name">Vaishnavi Paliwal</h3>
              <p className="about-team-role">Computer Engineering Student</p>
              <p className="about-team-desc">Passionate about building AI-driven solutions for healthcare.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-content">
          <p className="about-footer-text">© 2024 PCOSense. All rights reserved.</p>
          <div className="about-footer-links">
            <a className="about-footer-link" href="#">Privacy Policy</a>
            <a className="about-footer-link" href="#">Terms of Service</a>
            <a className="about-footer-link" href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
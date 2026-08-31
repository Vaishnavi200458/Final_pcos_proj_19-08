import React from "react";
import { Activity, Heart, Shield, User } from "lucide-react";

import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

import "./AboutUs.css";

export default function AboutUs({
  user,
  publicView = false,

  onNavigateToLogin,
  onNavigateToSignup,

  onDashboardClick,
  onPredictClick,
  onHealthSummaryClick,
  onRecordsClick,
  onAboutClick,
  onProfileClick,
  onLogout,
}) {
  return (
    <div className="about-wrapper">

      {/* PUBLIC NAVBAR - before login */}
      {publicView ? (
        <header className="about-public-header">
          <div className="about-public-nav">
            <div className="about-public-logo">
              PCOSense
            </div>

            <div className="about-public-actions">
              <button
                type="button"
                className="about-public-login"
                onClick={onNavigateToLogin}
              >
                Log In
              </button>

              <button
                type="button"
                className="about-public-signup"
                onClick={onNavigateToSignup}
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>
      ) : (
        /* LOGGED-IN NAVBAR */
        <AppNavbar
          user={user}
         currentPage="about"
         onDashboardClick={onDashboardClick}
         onPredictClick={onPredictClick}
         onHealthSummaryClick={onHealthSummaryClick}
         onRecordsClick={onRecordsClick}
         onAboutClick={onAboutClick}
         onProfileClick={onProfileClick}
         onLogout={onLogout}
        />
      )}

      <main className="about-main">
        {/* Hero */}
        <section className="about-hero">
          <div className="about-hero-pattern"></div>

          <div className="about-hero-content">
            <h1 className="about-hero-title">
              Meet the Team
            </h1>

            <p className="about-hero-desc">
              We're a passionate team of technologists dedicated to
              transforming PCOS care through AI-driven insights.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="about-values-section">
          <div className="about-values-grid">
            <div className="about-value-item">
              <div className="about-value-icon">
                <Activity size={32} />
              </div>

              <h3 className="about-value-title">
                Data-Driven
              </h3>

              <p className="about-value-desc">
                Leveraging advanced AI to uncover personalized insights and
                predictive health patterns.
              </p>
            </div>

            <div className="about-value-item">
              <div className="about-value-icon">
                <Heart size={32} />
              </div>

              <h3 className="about-value-title">
                Empathetic Care
              </h3>

              <p className="about-value-desc">
                Designing solutions with a deeper understanding of the daily
                challenges associated with PCOS.
              </p>
            </div>

            <div className="about-value-item">
              <div className="about-value-icon">
                <Shield size={32} />
              </div>

              <h3 className="about-value-title">
                Secure & Private
              </h3>

              <p className="about-value-desc">
                Prioritizing data security and user privacy throughout the
                health management experience.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-team-section">
          <div className="about-team-grid">
            <TeamMember name="Manasvi Naik" />
            <TeamMember name="Mehek Abhyankar" />
            <TeamMember name="Menaka Jadhav" />
            <TeamMember name="Vaishnavi Paliwal" />
          </div>
        </section>
      </main>

      {/* Only show your app footer after login */}
      {!publicView && <AppFooter />}
    </div>
  );
}

function TeamMember({ name }) {
  return (
    <div className="about-team-member">
      <div className="about-member-avatar">
        <User size={40} />
      </div>

      <h3 className="about-member-name">
        {name}
      </h3>

      <p className="about-member-role">
        Computer Engineering Student
      </p>

      <p className="about-member-desc">
        Passionate about building AI-driven solutions for healthcare.
      </p>
    </div>
  );
}
import "./LandingPage.css";
import {
  BrainCircuit,
  LayoutDashboard,
  HeartPulse,
   SearchCheck,
  ShieldCheck,
  Apple,
  ChartLine,
  CalendarHeart,
} from "lucide-react";
import heroImage from "../assets/h.png";


export default function LandingPage({ onLogin }) {
  return (
    <div className="landing">

      {/* Navbar */}

      <nav className="navbar">

        <div className="logo">
          PCOSCare
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#about">About</a>

          <button
            className="login-btn"
            onClick={onLogin}
          >
            Login
          </button>
        </div>

      </nav>

      {/* Hero */}

      <section className="hero-section">

        <div className="hero-left">

          <h1>
            Understand Your PCOS.
            <br />
            Take Control of Your Health.
          </h1>

          <p>
            Predict your PCOS risk using machine learning,
            receive personalized insights, and manage your
            reproductive health with confidence.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={onLogin}
            >
              Get Started
            </button>

            <button className="secondary-btn">
              Learn More
            </button>

          </div>

        </div>

        <div className="hero-right">

          <img
  src={heroImage}
  alt="Healthcare"
/>

        </div>

      </section>


      {/* Features */}

    <section className="features" id="features">

  <h2>Everything You Need to Manage PCOS</h2>

  <p className="features-subtitle">
    From early risk prediction to personalized health insights,
    PCOSCare provides AI-powered tools to support your wellness journey.
  </p>

  <div className="cards">

    {/* Card 1 */}

    <div className="card">

      <div className="card-icon">
        <BrainCircuit
          size={34}
          color="#986DFF"
          strokeWidth={2.2}
        />
      </div>

      <h3>AI Risk Prediction</h3>

      <p>
        Complete a quick health assessment and receive
        an instant PCOS risk prediction powered by
        advanced machine learning algorithms.
      </p>

    </div>

    {/* Card 2 */}

    <div className="card">

      <div className="card-icon">
        <LayoutDashboard
          size={34}
          color="#986DFF"
          strokeWidth={2.2}
        />
      </div>

      <h3>Personalized Dashboard</h3>

      <p>
        Explore an intelligent dashboard with
        customized insights, symptom analysis,
        lifestyle recommendations and AI guidance.
      </p>

    </div>

    {/* Card 3 */}

    <div className="card">

      <div className="card-icon">
        <HeartPulse
          size={34}
          color="#986DFF"
          strokeWidth={2.2}
        />
      </div>

      <h3>Health Monitoring</h3>

      <p>
        Track your symptoms, understand health
        trends over time and make informed
        decisions about your well-being.
      </p>

    </div>

  </div>

</section>

      {/* How */}

      <section className="steps" id="how">

  <h2>How It Works</h2>

  <p className="steps-subtitle">
    Begin your personalized PCOS wellness journey in four simple steps.
    Our AI-powered platform guides you from assessment to actionable
    health insights.
  </p>

  <div className="step-row">

    {/* Step 1 */}

    <div className="step">

      <span>1</span>

      <h3>Complete Your Assessment</h3>

      <p>
        Answer a short questionnaire about your symptoms,
        lifestyle, and medical history to help us understand
        your health profile.
      </p>

    </div>

    {/* Step 2 */}

    <div className="step">

      <span>2</span>

      <h3>AI Risk Analysis</h3>

      <p>
        Our machine learning model analyzes your responses
        and predicts your likelihood of PCOS using
        clinically relevant parameters.
      </p>

    </div>

    {/* Step 3 */}

    <div className="step">

      <span>3</span>

      <h3>Explore Your Dashboard</h3>

      <p>
        Access an interactive dashboard with visualized
        health data, symptom trends, and personalized
        insights generated just for you.
      </p>

    </div>

    {/* Step 4 */}

    <div className="step">

      <span>4</span>

      <h3>Follow Personalized Guidance</h3>

      <p>
        Receive tailored recommendations for nutrition,
        lifestyle, and long-term health management to
        support your wellness journey.
      </p>

    </div>

  </div>

</section>

      {/* more Boxes */}

      <section className="features" id="features">

  <h2>Everything You Need to Manage PCOS</h2>

  <p className="features-subtitle">
    From early risk prediction to personalized health insights,
    PCOSCare provides AI-powered tools to support your wellness journey.
  </p>

  <div className="cards">

  {/* Card 1 */}

  <div className="card">

    <div className="card-icon">
      <SearchCheck
        size={34}
        color="#986DFF"
        strokeWidth={2.2}
      />
    </div>

    <h3>Early Detection</h3>

    <p>
      Identify risks before they become chronic issues with proactive AI-powered screening and analysis.
    </p>

  </div>

  {/* Card 2 */}

  <div className="card">

    <div className="card-icon">
      <ShieldCheck
        size={34}
        color="#986DFF"
        strokeWidth={2.2}
      />
    </div>

    <h3>Secure Records</h3>

    <p>
      Your medical privacy is our priority. All health records are protected with secure encryption.
    </p>

  </div>

  {/* Card 3 */}

  <div className="card">

    <div className="card-icon">
      <Apple
        size={34}
        color="#986DFF"
        strokeWidth={2.2}
      />
    </div>

    <h3>Personalized Recommendations</h3>

    <p>
      Receive lifestyle, nutrition, and wellness recommendations tailored to your unique health profile.
    </p>

  </div>

  {/* Card 4 */}

  <div className="card">

    <div className="card-icon">
      <ChartLine
        size={34}
        color="#986DFF"
        strokeWidth={2.2}
      />
    </div>

    <h3>Interactive Graphs</h3>

    <p>
      Visualize hormone levels, weight, symptoms, and progress with intuitive interactive charts.
    </p>

  </div>

  {/* Card 5 */}

  <div className="card">

    <div className="card-icon">
      <LayoutDashboard
        size={34}
        color="#986DFF"
        strokeWidth={2.2}
      />
    </div>

    <h3>Easy-to-Use Dashboard</h3>

    <p>
      Navigate a clean, intuitive dashboard designed to simplify symptom logging and health tracking.
    </p>

  </div>

  {/* Card 6 */}

  <div className="card">

    <div className="card-icon">
      <CalendarHeart
        size={34}
        color="#986DFF"
        strokeWidth={2.2}
      />
    </div>

    <h3>Long-Term Monitoring</h3>

    <p>
      Monitor your health journey over time and discover meaningful trends in your symptoms and progress.
    </p>

  </div>

</div>

</section>

      {/* CTA */}

<section className="cta">

  <div className="cta-box">

    <h2>
      Ready to Take Control of Your Health?
    </h2>

    <p>
      Join the women using AI-powered insights to
      better understand and manage their PCOS journey.
    </p>

    <div className="cta-buttons">

      <button
        className="cta-primary-btn"
        onClick={onLogin}
      >
        Get Started
      </button>

      <button
        className="cta-secondary-btn"
      >
        Learn More
      </button>

    </div>

  </div>

</section>

      <footer>
        © 2026 PCOSCare | Manasvi Naik, Mehek Abhyankar, Menaka Jadhav, Vaishnavi Paliwal
      </footer>

    </div>
  );
}
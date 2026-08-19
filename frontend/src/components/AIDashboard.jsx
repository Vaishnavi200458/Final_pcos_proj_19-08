import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { getTrackerHistory } from "../api/trackerApi";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";



function AIDashboard({
  result,
  user,
  onDashboardClick,
  onPredictClick,
  onHealthSummaryClick,
  onRecordsClick,
  onAboutClick,
}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getTrackerHistory(user.id);
        setHistory(data || []);
      } catch (error) {
        console.error("Error loading history:", error);
      }
    };

    if (user?.id) {
      loadHistory();
    }
  }, [user]);

  const latest = history[0] || result?.input_data || null;
  const latestEntry = history[0] || result || null;

  const chartData = useMemo(() => {
    return (history || [])
      .slice()
      .reverse()
      .map((entry, index) => ({
        entryNo: `Entry ${index + 1}`,
        risk_score: Number(entry.risk_score || 0),
        weight: Number(entry.weight || 0),
        bmi: Number(entry.bmi || 0),
        cycle_length: Number(entry.cycle_length || 0),
      }));
  }, [history]);

  const symptomFrequency = useMemo(() => {
    const symptoms = [
      { key: "weight_gain", label: "Weight Gain" },
      { key: "hair_growth", label: "Hair Growth" },
      { key: "skin_darkening", label: "Skin Darkening" },
      { key: "hair_loss", label: "Hair Loss" },
      { key: "pimples", label: "Pimples" },
    ];

    return symptoms.map((symptom) => ({
      symptom: symptom.label,
      count: history.reduce(
        (sum, entry) => sum + (entry[symptom.key] === "Yes" ? 1 : 0),
        0
      ),
    }));
  }, [history]);

  const recommendations = useMemo(() => {
    if (!latest && !result) return [];

    const data = latest || {};
    const recs = [];

    recs.push({
      icon: "🥗",
      title: "Healthy Diet",
      text:
        data.fast_food === "Yes"
          ? "Reduce fast food and include more whole foods, vegetables, and protein."
          : "Maintain a balanced diet with fiber, protein, and healthy fats.",
    });

    recs.push({
      icon: "🚶",
      title: "Exercise Plan",
      text:
        data.regular_exercise === "No"
          ? "Start with walking or yoga for 20–30 minutes daily."
          : "Continue regular activity to support hormonal and metabolic health.",
    });

    recs.push({
      icon: "💧",
      title: "Hydration",
      text: "Drink enough water daily and reduce sugary drinks where possible.",
    });

    recs.push({
      icon: "🌙",
      title: "Sleep Better",
      text: "Maintain a regular sleep routine to support hormonal balance.",
    });

    return recs;
  }, [latest, result]);

  const recentActivities = history.slice(0, 4);

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const riskScore = latestEntry?.risk_score ?? result?.risk_score ?? "--";
  const riskLevel = latestEntry?.risk_level ?? result?.risk_level ?? "Not Available";
  const bmi = latestEntry?.bmi ?? result?.bmi ?? "--";
  const lastUpdate = latestEntry?.created_at
    ? new Date(latestEntry.created_at).toLocaleDateString()
    : result?.tracked_at || "Today";

  if (!user) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="new-dashboard">
      

      <AppNavbar
        user={user}
        currentPage="dashboard"
        onDashboardClick={() => {}}
       onPredictClick={onPredictClick}
       onHealthSummaryClick={onHealthSummaryClick}
       onRecordsClick={onRecordsClick}
        onAboutClick={onAboutClick}
      />

      <section className="dashboard-welcome">
        <div>
          <h1>Hello, {userName}</h1>
          <p>
            Track your PCOS risk, symptoms, and lifestyle trends in one calm,
            personalized dashboard.
          </p>
        </div>

        
      </section>

      <section className="metric-grid">
        <MetricCard icon="📊" label="Latest Prediction" value={`${riskScore}%`} tag="Risk" />
        <MetricCard icon="⚖️" label="Current BMI" value={bmi} tag="BMI" />
        <MetricCard icon="📅" label="Last Update" value={lastUpdate} tag="Update" />
        <MetricCard icon="🌿" label="Risk Category" value={riskLevel} tag="Status" />
      </section>

      <section className="quick-actions">
        <ActionCard icon="🔍" title="Predict PCOS" onClick={onPredictClick} />
        <ActionCard icon="📁" title="View Records" onClick={onRecordsClick} />
        <ActionCard icon="🩺" title="Health Summary" />
        <ActionCard icon="ℹ️" title="About Us" />
      </section>

      <section className="chart-grid">
        <DashboardChart title="PCOS Risk Trend">
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="entryNo" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="risk_score"
                  stroke="#6b21a8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </DashboardChart>

        <DashboardChart title="Weight Trend">
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="entryNo" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#7e22ce"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </DashboardChart>

        <DashboardChart title="BMI Progress">
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="entryNo" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#581c87"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </DashboardChart>

        <DashboardChart title="Symptom Frequency">
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={symptomFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symptom" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6b21a8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </DashboardChart>
      </section>

      <section className="recommendation-section">
        <h2>Personalized for You</h2>
        <div className="recommendation-grid">
          {recommendations.map((rec, index) => (
            <div className="recommendation-card" key={index}>
              <div className="rec-icon">{rec.icon}</div>
              <h3>{rec.title}</h3>
              <p>{rec.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bottom-grid">
        <div className="activity-card">
          <h2>Recent Activity</h2>

          {recentActivities.length === 0 ? (
            <p className="muted-text">No recent records yet.</p>
          ) : (
            recentActivities.map((entry, index) => (
              <div className="activity-item" key={index}>
                <span></span>
                <div>
                  <strong>Health record updated</strong>
                  <p>
                    Risk score {entry.risk_score}% ·{" "}
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="tip-card">
          <h2>Health Tip of the Day</h2>
          <p>
            Small consistent lifestyle changes, like regular movement, balanced
            meals, and cycle tracking, can help you understand your health
            patterns better.
          </p>
          <button className="secondary-action">Learn More</button>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}

function MetricCard({ icon, label, value, tag }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-tag">{tag}</span>
      </div>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}

function ActionCard({ icon, title, onClick }) {
  return (
    <button className="action-card" onClick={onClick}>
      <span>{icon}</span>
      <strong>{title}</strong>
    </button>
  );
}

function DashboardChart({ title, children }) {
  return (
    <div className="dashboard-chart-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="empty-chart">
      Save at least two tracking records to view this chart.
    </div>
  );
}

export default AIDashboard;
import { useState } from "react";
import { predictPCOS } from "../api/pcosApi";
import { saveTrackerEntry } from "../api/trackerApi";
import { RotateCcw } from "lucide-react";

import {
  User,
  Activity,
  HeartPulse,
  Dumbbell,
  Shield,
  Zap,
  CircleHelp,
} from "lucide-react";

import { FaFemale } from "react-icons/fa";
import "./PredictionForm.css";
import AppFooter from "./AppFooter";

function PredictionForm({ setResult, user, onLogout, result }) {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    waist: "",
    hip: "",
    cycle_regular: "Regular",
    cycle_length: "",
    weight_gain: "No",
    facial_hair_growth: "No",
    skin_darkening: "No",
    hair_loss: "No",
    pimples: "No",
    regular_exercise: "Yes",
    fast_food: "No",
    fast_food_frequency: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      // If fast food is changed to "No",
      // clear the frequency because it is no longer applicable.
      if (name === "fast_food" && value === "No") {
        updatedData.fast_food_frequency = "";
      }

      return updatedData;
    });
  };

  const handleReset = () => {
    setFormData({
      age: "",
      weight: "",
      height: "",
      waist: "",
      hip: "",
      cycle_regular: "Regular",
      cycle_length: "",
      weight_gain: "No",
      facial_hair_growth: "No",
      skin_darkening: "No",
      hair_loss: "No",
      pimples: "No",
      regular_exercise: "Yes",
      fast_food: "No",
      fast_food_frequency: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra validation for fast-food frequency
    if (
      formData.fast_food === "Yes" &&
      !formData.fast_food_frequency
    ) {
      alert("Please select how often you consume fast food.");
      return;
    }

    setLoading(true);

    const finalData = {
      ...formData,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      waist: Number(formData.waist),
      hip: Number(formData.hip),
      cycle_length: Number(formData.cycle_length),
    };

    try {
      const prediction = await predictPCOS(finalData);

      const fullResult = {
        ...prediction,
        input_data: finalData,
        tracked_at: new Date().toLocaleString(),
      };

      if (!user || !user.id) {
        alert("User not logged in properly.");
        setResult(fullResult);
        setLoading(false);
        return;
      }

      await saveTrackerEntry({
        user_id: user.id,
        ...finalData,
        bmi: prediction.bmi,
        waist_hip_ratio: prediction.waist_hip_ratio,
        pcos_risk: prediction.pcos_risk,
        risk_score: prediction.risk_score,
        probability: prediction.probability,
        risk_level: prediction.risk_level,
      });

      setResult(fullResult);
    } catch (error) {
      alert("Prediction failed.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="prediction-page">
      <div className="prediction-grid">

        {/* LEFT PANEL */}
        <div className="prediction-card">
          <h1 className="prediction-title">
            PCOS Risk Assessment
          </h1>

          <p className="prediction-subtitle">
            Fill in your health details to receive an
            AI-powered prediction.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Profile & Measurements */}
            <div className="section-header">
              <User size={20} />
              <h2>Profile & Measurements</h2>
            </div>

            <div className="input-grid">

              <div className="field-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label>Waist (inch)</label>
                <input
                  type="number"
                  name="waist"
                  value={formData.waist}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label>Hip (inch)</label>
                <input
                  type="number"
                  name="hip"
                  value={formData.hip}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Menstrual History */}
            <div className="section-header">
              <Activity size={20} />
              <h2>Menstrual History</h2>
            </div>

            <div className="input-grid">

              <div className="field-group">
                <label>Cycle Regularity</label>
                <select
                  name="cycle_regular"
                  value={formData.cycle_regular}
                  onChange={handleChange}
                >
                  <option>Regular</option>
                  <option>Irregular</option>
                </select>
              </div>

              <div className="field-group">
                <label>Cycle Length (days)</label>
                <input
                  type="number"
                  name="cycle_length"
                  value={formData.cycle_length}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Clinical Signs & Symptoms */}
            <div className="section-header">
              <HeartPulse size={20} />
              <h2>Clinical Signs & Symptoms</h2>
            </div>

            <div className="symptom-grid">

              <div className="field-group">
                <label>Weight Gain</label>
                <select
                  name="weight_gain"
                  value={formData.weight_gain}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              {/* Facial Hair Growth */}
              <div className="field-group">
                <label>Facial Hair Growth</label>
                <select
                  name="facial_hair_growth"
                  value={formData.facial_hair_growth}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="field-group">
                <label>Skin Darkening</label>
                <select
                  name="skin_darkening"
                  value={formData.skin_darkening}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="field-group">
                <label>Hair Loss</label>
                <select
                  name="hair_loss"
                  value={formData.hair_loss}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="field-group">
                <label>Pimples</label>
                <select
                  name="pimples"
                  value={formData.pimples}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

            </div>

            {/* Lifestyle Habits */}
            <div className="section-header">
              <Dumbbell size={20} />
              <h2>Lifestyle Habits</h2>
            </div>

            <div className="input-grid">

              <div className="field-group">
                <label>Regular Exercise</label>
                <select
                  name="regular_exercise"
                  value={formData.regular_exercise}
                  onChange={handleChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              {/* Fast Food Yes / No */}
              <div className="field-group">
                <label>Fast Food Consumption</label>
                <select
                  name="fast_food"
                  value={formData.fast_food}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              {/* Show frequency only if Fast Food = Yes */}
              {formData.fast_food === "Yes" && (
                <div className="field-group">
                  <label>How Often Do You Consume Fast Food?</label>
                  <select
                    name="fast_food_frequency"
                    value={formData.fast_food_frequency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              )}

            </div>

            {/* Buttons */}
            <div className="button-row">
              <button
                className="predict-btn"
                type="submit"
                disabled={loading}
              >
                <Zap size={18} />
                {loading
                  ? "Predicting..."
                  : "Predict PCOS"}
              </button>

              <button
                type="button"
                className="reset-btn"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="sidebar-card">

          <div className="illustration">
            <FaFemale />
          </div>

          <h3>
            <CircleHelp size={20} />
            Why we ask this?
          </h3>

          <p>
            We review your metabolic, lifestyle,
            and habit statistics to generate
            immediate health trends and estimate
            your PCOS risk.
          </p>

          <div className="badges">
            <span>AI-Driven Analysis</span>
          </div>

          <div className="privacy-card">
            <Shield />

            <div>
              <h4>
                Your data is private and secure.
              </h4>

              <p>
                Information remains confidential
                and is only used to generate your
                assessment.
              </p>
            </div>
          </div>

        </div>
      </div>

      <AppFooter />
    </div>
  );
}

export default PredictionForm;
import { useEffect, useMemo, useState } from "react";
import { predictPCOS } from "../api/pcosApi";
import {
  getTrackerHistory,
  updateTrackerEntry,
  deleteTrackerEntry,
} from "../api/trackerApi";
import { Pencil, Trash2 } from "lucide-react";

function HealthRecords({ user, onDashboardClick, onPredictClick, onAboutClick }) {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 8;

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await getTrackerHistory(user.id);
        setRecords(data || []);
      } catch (error) {
        console.error("Error loading health records:", error);
      }
    };

    if (user?.id) {
      loadRecords();
    }
  }, [user]);

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      const searchText =
        `${record.risk_level} ${record.risk_score} ${record.bmi} ${record.weight}`.toLowerCase();

      const matchesSearch = searchText.includes(searchTerm.toLowerCase());

      const recordDate = record.created_at
        ? new Date(record.created_at).toISOString().split("T")[0]
        : "";

      const matchesDate = selectedDate ? recordDate === selectedDate : true;

      return matchesSearch && matchesDate;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [records, searchTerm, selectedDate, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const totalPredictions = records.length;

  const averageRisk =
    records.length > 0
      ? (
          records.reduce((sum, item) => sum + Number(item.risk_score || 0), 0) /
          records.length
        ).toFixed(1)
      : "--";

  const currentBMI = records[0]?.bmi || "--";

  const lastUpdated = records[0]?.created_at
    ? new Date(records[0].created_at).toLocaleDateString()
    : "--";

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setEditForm({ ...record });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedInput = {
        age: Number(editForm.age),
        weight: Number(editForm.weight),
        height: Number(editForm.height),
        waist: Number(editForm.waist),
        hip: Number(editForm.hip),
        cycle_regular: editForm.cycle_regular,
        cycle_length: Number(editForm.cycle_length),
        weight_gain: editForm.weight_gain,
        hair_growth: editForm.hair_growth,
        skin_darkening: editForm.skin_darkening,
        hair_loss: editForm.hair_loss,
        pimples: editForm.pimples,
        regular_exercise: editForm.regular_exercise,
        fast_food: editForm.fast_food,
      };

      const newPrediction = await predictPCOS(updatedInput);

      const updatedRecordPayload = {
        ...editForm,

        age: updatedInput.age,
        weight: updatedInput.weight,
        height: updatedInput.height,
        waist: updatedInput.waist,
        hip: updatedInput.hip,

        cycle_regular: updatedInput.cycle_regular,
        cycle_length: updatedInput.cycle_length,

        weight_gain: updatedInput.weight_gain,
        hair_growth: updatedInput.hair_growth,
        skin_darkening: updatedInput.skin_darkening,
        hair_loss: updatedInput.hair_loss,
        pimples: updatedInput.pimples,
        regular_exercise: updatedInput.regular_exercise,
        fast_food: updatedInput.fast_food,

        bmi: newPrediction.bmi,
        waist_hip_ratio: newPrediction.waist_hip_ratio,
        pcos_risk: newPrediction.pcos_risk,
        risk_score: newPrediction.risk_score,
        probability: newPrediction.probability,
        risk_level: newPrediction.risk_level,
      };

      const updatedRows = await updateTrackerEntry(updatedRecordPayload);
      const updatedRecord = updatedRows[0];

      setRecords((prev) =>
        prev.map((item) =>
          item.id
            ? item.id === updatedRecord.id
              ? updatedRecord
              : item
            : item.created_at === updatedRecord.created_at
            ? updatedRecord
            : item
        )
      );

      setEditingRecord(null);
      setEditForm({});
      alert("Record updated and risk recalculated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Could not update and recalculate record. Please check backend.");
    }
  };

  const handleDelete = async (record) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this health record?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTrackerEntry(record);

      setRecords((prev) =>
        prev.filter((item) =>
          record.id
            ? item.id !== record.id
            : item.created_at !== record.created_at
        )
      );

      alert("Record deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete record. Please try again.");
    }
  };

  return (
    <div className="records-page">
      <nav className="dashboard-nav">
        <div className="brand">PCOSense</div>

        <div className="nav-links">
          <button onClick={onDashboardClick}>Dashboard</button>
          <button onClick={onPredictClick}>Predict PCOS</button>
          <button>Health Summary</button>
          <button className="active-nav">My Records</button>
          <button onClick={onAboutClick}>About Us</button>
        </div>

        <div className="profile-circle">{userName.charAt(0).toUpperCase()}</div>
      </nav>

      <section className="records-header">
        <div>
          <h1>My Health Records</h1>
          <p>
            Comprehensive history of your PCOS risk predictions and hormonal
            health tracking data.
          </p>
        </div>

        <div className="records-controls">
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {selectedDate && (
            <button onClick={() => setSelectedDate("")}>Clear Date</button>
          )}

          <button
            onClick={() =>
              setSortOrder((prev) =>
                prev === "latest" ? "oldest" : "latest"
              )
            }
          >
            {sortOrder === "latest" ? "Sort: Latest" : "Sort: Oldest"}
          </button>
        </div>
      </section>

      <section className="records-summary-grid">
        <RecordSummaryCard
          icon="📊"
          label="Total Predictions"
          value={totalPredictions}
          tag="Total"
        />
        <RecordSummaryCard
          icon="📈"
          label="Average Risk"
          value={`${averageRisk}%`}
          tag="Average"
        />
        <RecordSummaryCard
          icon="⚖️"
          label="Current BMI"
          value={currentBMI}
          tag="Current"
        />
        <RecordSummaryCard
          icon="🕘"
          label="Last Updated"
          value={lastUpdated}
          tag="Recent"
        />
      </section>

      <section className="records-table-card">
        {filteredRecords.length === 0 ? (
          <p className="muted-text">No health records found.</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Prediction</th>
                <th>Risk %</th>
                <th>BMI</th>
                <th>Weight</th>
                <th>Cycle Length</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.id || record.created_at}>
                  <td>{new Date(record.created_at).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`risk-pill ${getRiskClass(record.risk_level)}`}
                    >
                      {record.risk_level || "Not Available"}
                    </span>
                  </td>
                  <td>{record.risk_score}%</td>
                  <td>{record.bmi}</td>
                  <td>{record.weight} kg</td>
                  <td>{record.cycle_length} days</td>
                  <td>
  <div className="record-actions">
    <button
      className="icon-btn edit-btn"
      title="Edit Record"
      onClick={() => handleEditClick(record)}
    >
      <Pencil size={18} />
    </button>

    <button
      className="icon-btn delete-btn"
      title="Delete Record"
      onClick={() => handleDelete(record)}
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="records-table-footer">
          <p>
            Showing {filteredRecords.length === 0 ? 0 : startIndex + 1}-
            {Math.min(endIndex, filteredRecords.length)} of{" "}
            {filteredRecords.length} records
          </p>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="records-bottom-actions">
        <button className="floating-new-btn" onClick={onPredictClick}>
          + New Prediction
        </button>
      </section>

      {editingRecord && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>Edit Health Record</h2>
            <p className="muted-text">
              Edit symptoms and inputs. PCOS risk will be recalculated
              automatically.
            </p>

            <div className="edit-form-grid">
              <label>
                Age
                <input
                  type="number"
                  name="age"
                  value={editForm.age || ""}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Height
                <input
                  type="number"
                  name="height"
                  value={editForm.height || ""}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Weight
                <input
                  type="number"
                  name="weight"
                  value={editForm.weight || ""}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Waist
                <input
                  type="number"
                  name="waist"
                  value={editForm.waist || ""}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Hip
                <input
                  type="number"
                  name="hip"
                  value={editForm.hip || ""}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Cycle Length
                <input
                  type="number"
                  name="cycle_length"
                  value={editForm.cycle_length || ""}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Cycle Regularity
                <select
                  name="cycle_regular"
                  value={editForm.cycle_regular || "Regular"}
                  onChange={handleEditChange}
                >
                  <option>Regular</option>
                  <option>Irregular</option>
                </select>
              </label>

              <label>
                Weight Gain
                <select
                  name="weight_gain"
                  value={editForm.weight_gain || "No"}
                  onChange={handleEditChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>

              <label>
                Excess Hair Growth
                <select
                  name="hair_growth"
                  value={editForm.hair_growth || "No"}
                  onChange={handleEditChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>

              <label>
                Skin Darkening
                <select
                  name="skin_darkening"
                  value={editForm.skin_darkening || "No"}
                  onChange={handleEditChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>

              <label>
                Hair Loss
                <select
                  name="hair_loss"
                  value={editForm.hair_loss || "No"}
                  onChange={handleEditChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>

              <label>
                Pimples
                <select
                  name="pimples"
                  value={editForm.pimples || "No"}
                  onChange={handleEditChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>

              <label>
                Regular Exercise
                <select
                  name="regular_exercise"
                  value={editForm.regular_exercise || "Yes"}
                  onChange={handleEditChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>

              <label>
                Fast Food Habit
                <select
                  name="fast_food"
                  value={editForm.fast_food || "No"}
                  onChange={handleEditChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
            </div>

            <div className="edit-modal-actions">
              <button onClick={() => setEditingRecord(null)}>Cancel</button>
              <button className="floating-new-btn" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="dashboard-footer">
        <div className="footer-brand-block">
          <strong>PCOSense</strong>
          <p>
            © 2026 Manasvi Naik, Menaka Jadhav, Mehek Abhyankar and Vaishnavi
            Paliwal. All rights reserved.
          </p>
        </div>

        <div className="footer-links">
          <button onClick={onDashboardClick}>Dashboard</button>
          <button onClick={onPredictClick}>Predict PCOS</button>
          <button>Health Summary</button>
          <button>My Records</button>
          <button onClick={onAboutClick}>About Us</button>
        </div>
      </footer>
    </div>
  );
}

function RecordSummaryCard({ icon, label, value, tag }) {
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

function getRiskClass(level = "") {
  const risk = level.toLowerCase();

  if (risk.includes("high")) return "risk-high";
  if (risk.includes("medium") || risk.includes("moderate"))
    return "risk-medium";
  if (risk.includes("low")) return "risk-low";

  return "risk-neutral";
}

export default HealthRecords;
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  Pencil,
  LockKeyhole,
} from "lucide-react";

import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";
import "./Profile.css";
import { supabase } from "../supabaseClient";

function Profile({
  user,
  setUser,
  onDashboardClick,
  onPredictClick,
  onHealthSummaryClick,
  onRecordsClick,
  onAboutClick,
  onProfileClick,
  onLogout,
}) {
  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail = user?.email || "Not available";

  const phone =
    user?.user_metadata?.phone || "Not added";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(
  user?.user_metadata?.full_name || ""
);

const [phoneNumber, setPhoneNumber] = useState(
  user?.user_metadata?.phone || ""
);

const [saving, setSaving] = useState(false);
const [showPasswordForm, setShowPasswordForm] = useState(false);
const [newPassword, setNewPassword] = useState("");
const [confirmNewPassword, setConfirmNewPassword] = useState("");
const [passwordLoading, setPasswordLoading] = useState(false);

const handleSaveProfile = async () => {
  if (!fullName.trim()) {
    alert("Please enter your full name.");
    return;
  }

  setSaving(true);

  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phoneNumber.trim(),
      },
    });

    if (error) {
      throw error;
    }

    if (data?.user) {
      setUser(data.user);
    }

    setIsEditing(false);
    alert("Profile updated successfully.");
  } catch (error) {
    console.error("Profile update failed:", error);
    alert("Could not update profile. Please try again.");
  } finally {
    setSaving(false);
  }
};

const handleChangePassword = async () => {
  if (newPassword.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  if (!/[A-Z]/.test(newPassword)) {
    alert("Password must contain at least one uppercase letter.");
    return;
  }

  if (!/[a-z]/.test(newPassword)) {
    alert("Password must contain at least one lowercase letter.");
    return;
  }

  if (!/[0-9]/.test(newPassword)) {
    alert("Password must contain at least one number.");
    return;
  }

  if (!/[!@#$%^&*]/.test(newPassword)) {
    alert("Password must contain at least one special character.");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert("Passwords do not match.");
    return;
  }

  setPasswordLoading(true);

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    alert("Password updated successfully.");

    setNewPassword("");
    setConfirmNewPassword("");
    setShowPasswordForm(false);
  } catch (error) {
    console.error("Password update failed:", error);
    alert(error.message || "Could not update password.");
  } finally {
    setPasswordLoading(false);
  }
};

  return (
    <div className="profile-page">
      <AppNavbar
        user={user}
        currentPage="profile"
        onDashboardClick={onDashboardClick}
        onPredictClick={onPredictClick}
        onHealthSummaryClick={onHealthSummaryClick}
        onRecordsClick={onRecordsClick}
        onAboutClick={onAboutClick}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
      />

      <main className="profile-main">
        <section className="profile-heading">
          <div>
            <h1>My Profile</h1>
            <p>
              Manage your personal information and account settings.
            </p>
          </div>
        </section>

        <section className="profile-layout">

          {/* LEFT PROFILE CARD */}
          <div className="profile-identity-card">
            <div className="profile-large-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <h2>{userName}</h2>
            <p>{userEmail}</p>

            <div className="profile-status">
              <span className="status-dot"></span>
              Active Account
            </div>

            <div className="profile-member-info">
              <CalendarDays size={17} />

              <div>
                <span>Member since</span>
                <strong>{memberSince}</strong>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="profile-content">

            {/* PERSONAL INFORMATION */}
            <section className="profile-info-card">
              <div className="profile-card-header">
                <div>
                  <h2>Personal Information</h2>
                  <p>
                    Your basic account information.
                  </p>
                </div>

                <button
                  type="button"
                  className="profile-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              </div>

              <div className="profile-info-grid">
                <ProfileField
                  icon={<User size={19} />}
                  label="Full Name"
                  value={userName}
                />

                <ProfileField
                  icon={<Mail size={19} />}
                  label="Email Address"
                  value={userEmail}
                />

                <ProfileField
                  icon={<Phone size={19} />}
                  label="Phone Number"
                  value={phone}
                />

                <ProfileField
                  icon={<ShieldCheck size={19} />}
                  label="Account Status"
                  value="Active"
                />
              </div>

              {isEditing && (
  <div className="profile-edit-form">
    <div className="profile-edit-field">
      <label>Full Name</label>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter your full name"
      />
    </div>

    <div className="profile-edit-field">
      <label>Phone Number</label>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
      />
    </div>

    <div className="profile-edit-actions">
      <button
        type="button"
        className="profile-cancel-btn"
        onClick={() => {
          setFullName(user?.user_metadata?.full_name || "");
          setPhoneNumber(user?.user_metadata?.phone || "");
          setIsEditing(false);
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        className="profile-save-btn"
        onClick={handleSaveProfile}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </div>
)}
            </section>

            {/* SECURITY */}
            <section className="profile-info-card">
  <div className="profile-card-header">
    <div>
      <h2>Account Security</h2>
      <p>Manage your password and account security.</p>
    </div>
  </div>

  <div className="security-row">
    <div className="security-icon">
      <LockKeyhole size={21} />
    </div>

    <div className="security-text">
      <strong>Password</strong>
      <span>
        Keep your password secure and update it when necessary.
      </span>
    </div>

    <button
      type="button"
      className="change-password-btn"
      onClick={() => setShowPasswordForm((prev) => !prev)}
    >
      {showPasswordForm ? "Cancel" : "Change Password"}
    </button>
  </div>

  {showPasswordForm && (
    <div className="password-change-form">
      <div className="profile-edit-field">
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      <div className="profile-edit-field">
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>

      <div className="profile-edit-actions">
        <button
          type="button"
          className="profile-cancel-btn"
          onClick={() => {
            setShowPasswordForm(false);
            setNewPassword("");
            setConfirmNewPassword("");
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="profile-save-btn"
          onClick={handleChangePassword}
          disabled={passwordLoading}
        >
          {passwordLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  )}
</section>

            {/* PRIVACY NOTE */}
            <section className="profile-privacy-card">
              <ShieldCheck size={22} />

              <div>
                <strong>Your account information is protected</strong>

                <p>
                  Your profile details are used to personalize your PCOSense
                  experience and are not displayed publicly.
                </p>
              </div>
            </section>

          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}


function ProfileField({ icon, label, value }) {
  return (
    <div className="profile-field">
      <div className="profile-field-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default Profile;
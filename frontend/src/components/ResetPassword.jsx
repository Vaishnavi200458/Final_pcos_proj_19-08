
import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import "./PasswordRecovery.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      setHasSession(Boolean(data?.session) && !error);
      setChecking(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return;

        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          setHasSession(Boolean(session));
          setChecking(false);
        }

        if (event === "SIGNED_OUT") {
          setHasSession(false);
        }
      }
    );

    checkSession();

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*]/.test(password)) {
      setErrorMessage(
        "Use an uppercase letter, lowercase letter, number, and special character (!@#$%^&*)."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      // End the temporary recovery session.
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("Sign-out after recovery:", signOutError);
      }
    } catch (error) {
      console.error("Password update error:", error);
      setErrorMessage(
        error.message || "Could not update your password."
      );
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    window.location.replace("/");
  };

  return (
    <div className="recovery-page">
      <header className="recovery-header">
        <span className="recovery-logo">PCOSense</span>
      </header>

      <main className="recovery-main">
        <div className="recovery-card">
          <div className="recovery-icon">
            <KeyRound size={28} />
          </div>

          {checking ? (
            <>
              <h1>Verifying Link</h1>
              <p className="recovery-description">
                Please wait while we verify your password reset link.
              </p>
              <Loader2 className="recovery-spinner" size={24} />
            </>
          ) : success ? (
            <>
              <h1>Password Updated!</h1>
              <p className="recovery-description">
                Your password has been changed successfully.
                You can now log in using your new password.
              </p>

              <button
                className="recovery-primary-btn"
                onClick={goToLogin}
              >
                Back to Login
              </button>
            </>
          ) : !hasSession ? (
            <>
              <h1>Link Unavailable</h1>
              <p className="recovery-description">
                This password reset link is invalid, expired,
                or has already been used. Please request a new link.
              </p>

              <button
                className="recovery-primary-btn"
                onClick={goToLogin}
              >
                Return to Login
              </button>
            </>
          ) : (
            <>
              <h1>Set New Password</h1>
              <p className="recovery-description">
                Create a new secure password for your PCOSense account.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="new-password">
                  New Password
                </label>

                <div className="recovery-password-field">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <label htmlFor="confirm-password">
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  required
                />

                <p className="recovery-hint">
                  At least 8 characters, including uppercase,
                  lowercase, number, and special character.
                </p>

                {errorMessage && (
                  <p className="recovery-error" role="alert">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="recovery-primary-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="recovery-spinner" size={18} />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

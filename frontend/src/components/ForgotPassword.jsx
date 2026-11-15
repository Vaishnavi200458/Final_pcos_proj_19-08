
import { useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "../supabaseClient";
import "./PasswordRecovery.css";

export default function ForgotPassword({
  initialEmail = "",
  onBackToLogin,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      setSent(true);
    } catch (error) {
      console.error("Password recovery error:", error);
      setErrorMessage(
        error.message || "Unable to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-page">
      <header className="recovery-header">
        <span className="recovery-logo">PCOSense</span>
      </header>

      <main className="recovery-main">
        <div className="recovery-card">
          <div className="recovery-icon">
            <Mail size={28} />
          </div>

          {sent ? (
            <>
              <h1>Check Your Email</h1>
              <p className="recovery-description">
                If an account exists for this email, a password reset
                link will be sent to:
              </p>
              <p className="recovery-email">{email}</p>
              <p className="recovery-hint">
                Check your inbox and spam folder. The link may take
                a moment to arrive.
              </p>

              <button
                type="button"
                className="recovery-primary-btn"
                onClick={() => setSent(false)}
              >
                Try Another Email
              </button>
            </>
          ) : (
            <>
              <h1>Forgot Password?</h1>
              <p className="recovery-description">
                Enter your registered email address and we'll send
                you a secure link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="recovery-email">
                  Email Address
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          )}

          <button
            type="button"
            className="recovery-back-btn"
            onClick={onBackToLogin}
          >
            <ArrowLeft size={17} />
            Back to Login
          </button>
        </div>
      </main>
    </div>
  );
}

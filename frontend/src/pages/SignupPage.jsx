import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"> {/* bg-gray-900 removed, inherits from body */}
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-[var(--ctp-sky)] hover:text-[var(--ctp-teal)] mb-4 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl text-[var(--ctp-text)]">🎯</span>
            <h1 className="text-2xl font-bold text-[var(--ctp-text)]">GoalFlow</h1>
          </div>
        </div>

        <div className="card p-8 shadow-xl"> {/* Use .card class */}
          <h2 className="text-3xl font-extrabold text-[var(--ctp-text)] text-center mb-8">
            Create your account
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[var(--ctp-red)]/20 border border-[var(--ctp-red)]/50 text-[var(--ctp-red)] px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="input-field w-full px-4 py-3 placeholder-[var(--ctp-overlay0)]"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input-field w-full px-4 py-3 placeholder-[var(--ctp-overlay0)]"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="input-field w-full px-4 py-3 placeholder-[var(--ctp-overlay0)]"
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ctp-subtext0)] mb-2">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-field w-full px-4 py-3 placeholder-[var(--ctp-overlay0)]"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="button-primary w-full flex justify-center py-3 px-4 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-[var(--ctp-subtext0)]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-[var(--ctp-peach)] hover:text-[var(--ctp-flamingo)] transition-colors"
                >
                  Sign in
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

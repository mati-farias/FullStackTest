import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { apiClient } from "../api/client";
import type { ApiResponse, AuthPayload, UserRole } from "@test/shared";

export function RegisterPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("AUTHOR");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await apiClient.post<ApiResponse<AuthPayload>>(
        "/api/auth/register",
        {
          email,
          password,
          name,
          role,
        },
      );

      login(data);
      void navigate("/documents");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <span className="auth-icon" aria-hidden="true" />
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Join your team&apos;s document approval workflow.
        </p>
      </div>

      <div className="card auth-card">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="form-row">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Jamie Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Role</label>
            <div className="role-options" role="group" aria-label="Role">
              {(["AUTHOR", "REVIEWER", "ADMIN"] as UserRole[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`role-option${
                    role === item ? " role-option--active" : ""
                  }`}
                  onClick={() => setRole(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error !== null && (
            <p className="error-text">{error}</p>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

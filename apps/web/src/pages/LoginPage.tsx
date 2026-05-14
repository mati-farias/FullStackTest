import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { apiClient } from "../api/client";
import type { ApiResponse, AuthPayload } from "@test/shared";

export function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        "/api/auth/login",
        {
          email,
          password,
        },
      );
      login(data);
      void navigate("/documents");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <span className="auth-icon" aria-hidden="true" />
        <h1 className="auth-title">Sign in to your workspace</h1>
        <p className="auth-subtitle">
          Manage documents through their approval lifecycle.
        </p>
      </div>

      <div className="card auth-card">
        <form onSubmit={(e) => void handleSubmit(e)}>
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
          {error !== null && (
            <p className="error-text">{error}</p>
          )}
          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <div className="demo-note">
        <strong>Demo accounts</strong>
        author@demo.io &middot; reviewer@demo.io &middot; admin@demo.io
        <br />
        Password for all: demo1234
      </div>
    </div>
  );
}

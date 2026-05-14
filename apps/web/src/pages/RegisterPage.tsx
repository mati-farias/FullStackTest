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
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      <h1>Create account</h1>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: 4 }}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 4 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: 4 }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="role" style={{ display: "block", marginBottom: 4 }}>
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          >
            <option value="AUTHOR">Author</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {error !== null && (
          <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

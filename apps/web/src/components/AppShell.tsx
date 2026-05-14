import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout(): void {
    logout();
    void navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <Link to="/documents" className="app-shell__brand">
          Document Approval
        </Link>

        {user !== null && (
          <div className="app-shell__user">
            <span
              className="app-shell__user-name"
              aria-label={`Signed in as ${user.name} (${user.role})`}
            >
              {user.name}
              <span className="app-shell__role-chip">{user.role}</span>
            </span>
            <button className="app-shell__button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </header>

      <main className="app-shell__main">{children}</main>
    </div>
  );
}

import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

export function NavBar() {
  const { logout, user } = useAuth();

  if (!user) return null;

  return (
    <div className="navbar-container">
      <h1>CloudVault</h1>

      <nav className="navigation">
        <Link className="nav-link" to="/mydrive">
          My Drive
        </Link>
      </nav>

      <div className="profile-section">
  <div className="profile-info">
    <img
      src={user.photoUrl || "/assets/default-profile.png"}
      alt="Profile"
      className="profile-pic"
    />
    <span>{user.firstName}</span>
  </div>

  <button type="button" onClick={logout}>
    <img src="/assets/logout.png" alt="Logout" />
    Logout
  </button>
</div>
    </div>
  );
}
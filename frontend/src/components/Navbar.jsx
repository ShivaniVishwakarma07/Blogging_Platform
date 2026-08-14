import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          BlogSpace
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="nav-link text-white">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="nav-link text-white">
                Profile
              </Link>

              <Link to="/create-post" className="btn btn-light btn-sm px-3">
                Write
              </Link>

              <span className="text-white">Hi, {user.name}</span>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link text-white">
                Login
              </Link>

              <Link to="/register" className="btn btn-light btn-sm px-3">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

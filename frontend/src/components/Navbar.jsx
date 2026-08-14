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

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <Link to="/" className="nav-link text-white">
              Home
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="nav-link text-white">
                  Profile
                </Link>

                <Link
                  to="/create-post"
                  className="btn btn-light btn-sm px-3 my-2 my-lg-0"
                >
                  Write
                </Link>

                <span className="text-white user-greeting">
                  Hi, {user.name}
                </span>

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

                <Link
                  to="/register"
                  className="btn btn-light btn-sm px-3 my-2 my-lg-0"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

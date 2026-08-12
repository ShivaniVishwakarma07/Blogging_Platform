import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          BlogSpace
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link className="nav-link text-white" to="/">
            Home
          </Link>

          {user ? (
            <>
              <Link className="nav-link text-white" to="/create-post">
                Write
              </Link>

              <span className="text-white">{user.name}</span>

              <button className="btn btn-outline-light btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link text-white" to="/login">
                Login
              </Link>

              <Link className="btn btn-light btn-sm" to="/register">
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

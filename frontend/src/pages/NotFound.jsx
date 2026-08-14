import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-5">
      <div className="display-1 fw-bold">404</div>

      <h2 className="fw-bold mt-3">Page Not Found</h2>

      <p className="text-muted mb-4">
        The page you're looking for doesn't exist.
      </p>

      <Link to="/" className="btn btn-dark px-4">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;

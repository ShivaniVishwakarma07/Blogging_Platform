import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/posts/${id}`);
      setPost(response.data.post);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(`/posts/${id}`);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-5">
        <h3>Post not found</h3>
        <Link to="/" className="btn btn-dark mt-3">
          Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor = user && post.author?._id === user.id;

  return (
    <article className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <div className="mb-4">
              <h1 className="display-6 fw-bold">{post.title}</h1>

              <div className="text-muted">
                <span>By {post.author?.name || "Unknown"}</span>

                {post.createdAt && (
                  <span className="ms-3">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4" style={{ whiteSpace: "pre-wrap" }}>
              {post.content}
            </div>

            {isAuthor && (
              <div className="d-flex gap-2">
                <Link to={`/edit-post/${post._id}`} className="btn btn-dark">
                  Edit Post
                </Link>

                <button
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            )}

            <Link to="/" className="btn btn-link mt-3 px-0">
              ← Back to Posts
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostDetails;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/posts");

      const userPosts = response.data.posts.filter(
        (post) => post.author?._id === user?.id,
      );

      setPosts(userPosts);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(postId);
      setError("");

      await api.delete(`/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-5">
        <h3>Please login to view your profile.</h3>

        <Link to="/login" className="btn btn-dark mt-3">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="text-center mb-5">
        <div
          className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: "90px",
            height: "90px",
            fontSize: "32px",
          }}
        >
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <h1 className="fw-bold mb-1">{user.name}</h1>

        <p className="text-muted mb-0">{user.email}</p>
      </section>

      <section>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Posts</h2>

            <p className="text-muted mb-0">Manage the posts you've created.</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-dark px-3 py-2">
              {posts.length} Posts
            </span>

            <Link to="/create-post" className="btn btn-dark">
              + New Post
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"></div>

            <p className="text-muted mt-3">Loading your posts...</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="empty-state text-center">
            <h4>No posts yet</h4>

            <p className="text-muted">
              Start sharing your ideas with the community.
            </p>

            <Link to="/create-post" className="btn btn-dark">
              Create Your First Post
            </Link>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="row g-4">
            {posts.map((post) => (
              <div className="col-md-6 col-lg-4" key={post._id}>
                <div className="card h-100 border-0 shadow-sm post-card">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="mb-3">
                      <span className="badge text-bg-light border">
                        My Article
                      </span>
                    </div>

                    <h5 className="fw-bold">{post.title}</h5>

                    <p className="text-muted">
                      {post.content.length > 150
                        ? `${post.content.substring(0, 150)}...`
                        : post.content}
                    </p>

                    <div className="d-flex gap-2 mt-auto flex-wrap">
                      <Link
                        to={`/posts/${post._id}`}
                        className="btn btn-outline-dark btn-sm"
                      >
                        Read
                      </Link>

                      <Link
                        to={`/edit-post/${post._id}`}
                        className="btn btn-dark btn-sm"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                      >
                        {deletingId === post._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;

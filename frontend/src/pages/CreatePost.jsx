import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/posts", formData);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create post. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="mb-4">Create a New Post</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your post title"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Content
                </label>

                <textarea
                  id="content"
                  name="content"
                  className="form-control"
                  rows="10"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your post..."
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Post"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;

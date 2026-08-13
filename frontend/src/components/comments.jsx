import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Comments({ postId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/comments/${postId}`);

      setComments(response.data.comments);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post("/comments", {
        postId,
        content,
      });

      setComments((currentComments) => [
        response.data.comment,
        ...currentComments,
      ]);

      setContent("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleEditSave = async (commentId) => {
    if (!editContent.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setError("");

      const response = await api.put(`/comments/${commentId}`, {
        content: editContent,
      });

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment._id === commentId ? response.data.comment : comment,
        ),
      );

      setEditingId(null);
      setEditContent("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update comment.");
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/comments/${commentId}`);

      setComments((currentComments) =>
        currentComments.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete comment.");
    }
  };

  return (
    <section className="mt-5">
      <h3 className="mb-4">Comments ({comments.length})</h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Write a comment..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {!user && (
        <div className="alert alert-light border">
          Login to join the discussion.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-muted py-3">
          No comments yet. Be the first to comment.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {comments.map((comment) => {
            const isOwner = user && comment.user?._id === user.id;

            return (
              <div key={comment._id} className="border rounded p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{comment.user?.name || "User"}</strong>

                    {comment.createdAt && (
                      <small className="text-muted ms-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>

                  {isOwner && editingId !== comment._id && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleEditStart(comment)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingId === comment._id ? (
                  <div className="mt-3">
                    <textarea
                      className="form-control mb-2"
                      rows="3"
                      value={editContent}
                      onChange={(event) => setEditContent(event.target.value)}
                    ></textarea>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-dark"
                        onClick={() => handleEditSave(comment._id)}
                      >
                        Save
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-0 mt-2">{comment.content}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Comments;

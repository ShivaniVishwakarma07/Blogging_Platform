import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/posts", {
        params: {
          search: searchParams.get("search") || "",
          page: currentPage,
          limit: 6,
        },
      });

      setPosts(response.data.posts);

      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    params.page = 1;

    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = {};
    const currentSearch = searchParams.get("search");

    if (currentSearch) {
      params.search = currentSearch;
    }

    params.page = page;

    setSearchParams(params);
  };

  return (
    <div>
      <section className="text-center py-5 mb-4">
        <span className="badge bg-dark mb-3 px-3 py-2">
          Welcome to BlogSpace
        </span>

        <h1 className="display-4 fw-bold mb-3">
          Discover Ideas.
          <br />
          Share Your Story.
        </h1>

        <p className="lead text-muted mx-auto home-subtitle">
          A simple space to read interesting stories, share your thoughts, and
          connect through ideas.
        </p>

        <Link to="/create-post" className="btn btn-dark px-4 py-2 mt-3">
          Start Writing
        </Link>
      </section>

      <section className="mb-5">
        <form onSubmit={handleSearch} className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="input-group input-group-lg shadow-sm">
              <input
                type="text"
                className="form-control"
                placeholder="Search articles..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <button className="btn btn-dark px-4" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
      </section>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>

          <p className="text-muted mt-3">Loading posts...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-5">
          <div className="empty-state">
            <h4>No posts found</h4>

            <p className="text-muted mb-3">
              Try searching with a different keyword.
            </p>

            <button
              className="btn btn-outline-dark"
              onClick={() => {
                setSearch("");
                setSearchParams({ page: 1 });
              }}
            >
              View All Posts
            </button>
          </div>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Latest Stories</h2>

              <p className="text-muted mb-0">Explore our latest articles.</p>
            </div>
          </div>

          <div className="row g-4">
            {posts.map((post) => (
              <div className="col-md-6 col-lg-4" key={post._id}>
                <article className="card h-100 border-0 shadow-sm post-card">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="mb-3">
                      <span className="badge text-bg-light border">
                        Article
                      </span>
                    </div>

                    <h5 className="card-title fw-bold mb-2">{post.title}</h5>

                    <div className="small text-muted mb-3">
                      By {post.author?.name || "Unknown"}
                    </div>

                    <p className="card-text text-muted">
                      {post.content.length > 150
                        ? `${post.content.substring(0, 150)}...`
                        : post.content}
                    </p>

                    <Link
                      to={`/posts/${post._id}`}
                      className="btn btn-outline-dark mt-auto"
                    >
                      Read Article →
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${
                    pagination.currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {Array.from(
                  {
                    length: pagination.totalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === pagination.currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    pagination.currentPage === pagination.totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default Home;

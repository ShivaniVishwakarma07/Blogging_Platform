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
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Discover Great Stories</h1>

        <p className="text-muted">
          Read, write and share your ideas with the community.
        </p>
      </div>

      <form onSubmit={handleSearch} className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search posts..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button className="btn btn-dark" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-5">
          <h4>No posts found</h4>
          <p className="text-muted">Try searching for something else.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <div className="row g-4">
            {posts.map((post) => (
              <div className="col-md-6 col-lg-4" key={post._id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.title}</h5>

                    <p className="text-muted small mb-2">
                      By {post.author?.name || "Unknown"}
                    </p>

                    <p className="card-text text-muted">
                      {post.content.length > 150
                        ? `${post.content.substring(0, 150)}...`
                        : post.content}
                    </p>

                    <Link
                      to={`/posts/${post._id}`}
                      className="btn btn-outline-dark mt-auto"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
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

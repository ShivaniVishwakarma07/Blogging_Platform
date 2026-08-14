import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <main className="container py-5">{children}</main>

      <footer className="border-top bg-white py-4 mt-5">
        <div className="container text-center text-muted">
          <small>© 2026 BlogSpace. Built with the MERN stack.</small>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

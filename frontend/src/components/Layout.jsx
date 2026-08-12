import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <main className="container py-4">{children}</main>
    </>
  );
}

export default Layout;

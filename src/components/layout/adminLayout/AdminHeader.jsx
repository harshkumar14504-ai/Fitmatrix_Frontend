// import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminHeader() {
  const nav = useNavigate();
  const logout = (e) => {
    e.preventDefault();
    toast.success("Logout Successfully");
    localStorage.clear();
    nav("/");
  };
  return (
    <>
      {/* Modal Search Start */}
      <div
        className="modal fade"
        id="searchModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content rounded-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Search by keyword
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body d-flex align-items-center bg-primary">
              <div className="input-group w-75 mx-auto d-flex">
                <input
                  type="search"
                  className="form-control p-3"
                  placeholder="keywords"
                  aria-describedby="search-icon-1"
                />
                <span
                  id="search-icon-1"
                  className="btn bg-light border nput-group-text p-3"
                >
                  <i className="fa fa-search" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Search End */}
      {/* Navbar & Hero Start */}
    <div className="container-fluid header-top">
  <div className="nav-shaps-2" />

  <div className="container">
    <div className="d-flex flex-column flex-lg-row align-items-lg-center">

      {/* LOGO */}
      <div className="d-flex justify-content-between align-items-center w-100 w-lg-auto">
        <a href="#" className="navbar-brand m-0" style={{ height: 125 }}>
          <h1
            className="mb-0 d-flex align-items-center gap-2 flex-wrap"
          >
            <i className="fas fa-dumbbell text-danger" />

            <span
              style={{
                fontWeight: 900,
                letterSpacing: "2px",
                color: "white",
                fontSize: "clamp(22px,4vw,38px)",
              }}
            >
              FIT-MATRIX
            </span>
          </h1>
        </a>

        {/* TOGGLER */}
        <button
          className="navbar-toggler d-lg-none border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="fa fa-bars text-white fs-2" />
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-100">

        {/* TOPBAR */}
        <div
          className="topbar px-0 py-2 d-none d-lg-block"
          style={{ minHeight: 45 }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap">

            <div className="d-flex flex-wrap gap-3">

              <a
                href="mailto:example@gmail.com"
                className="text-muted small text-decoration-none"
              >
                <i className="fas fa-envelope text-primary me-2" />
                FitMatrix@gmail.com
              </a>

              <a
                href="#"
                className="text-muted small text-decoration-none"
              >
                <i className="fa fa-clock text-primary me-2" />
                OPEN 24 hours, 7 days a week!
              </a>

            </div>
          </div>
        </div>

        {/* NAVBAR */}
        <div className="nav-bar">
          <nav className="navbar navbar-expand-lg navbar-light p-0">

            <div className="collapse navbar-collapse" id="navbarCollapse">

              <div className="navbar-nav mx-auto align-items-lg-center text-center text-lg-start w-100">

                <Link
                  to="/admin/dashboard"
                  className="nav-item nav-link"
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/customers"
                  className="nav-item nav-link"
                >
                  Customers
                </Link>

                <Link
                  to="/admin/trainer/manage"
                  className="nav-item nav-link"
                >
                  Manage Trainers
                </Link>

                <Link
                  to="/admin/batch/manage"
                  className="nav-item nav-link"
                >
                  Manage Batches
                </Link>

                <Link
                  to="/admin/requests/manage"
                  className="nav-item nav-link"
                >
                  Manage Requests
                </Link>

                {/* DROPDOWN */}
                <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Pages
                  </a>

                  <div className="dropdown-menu">

                    <Link
                      to="/admin/diets"
                      className="dropdown-item"
                    >
                      View Diets
                    </Link>

                    <Link
                      to="/admin/exercises"
                      className="dropdown-item"
                    >
                      View Exercises
                    </Link>

                    <Link
                      to="/admin/progress"
                      className="dropdown-item"
                    >
                      View Progress
                    </Link>

                    <Link
                      to="/admin/contact/manage"
                      className="dropdown-item"
                    >
                      Manage Contact
                    </Link>

                  </div>
                </div>

                {/* BUTTONS */}
                <div
                  className="
                    d-flex
                    flex-column
                    flex-lg-row
                    gap-2
                    ms-lg-auto
                    mt-3
                    mt-lg-0
                  "
                >
                  {localStorage.getItem("token") ? (
                    <button
                      className="btn btn-primary py-2 px-3"
                      onClick={logout}
                    >
                      LOGOUT
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="btn btn-primary py-2 px-3"
                      >
                        REGISTER
                      </Link>

                      <Link
                        to="/login"
                        className="btn btn-primary py-2 px-3"
                      >
                        LOGIN
                      </Link>
                    </>
                  )}
                </div>

              </div>

              <div className="nav-shaps-1" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</div>
      {/* Navbar & Hero End */}

      {/* Header Start
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h4
                        className="text-white display-4 mb-4 wow fadeInDown"
                        data-wow-delay="0.1s"
                    >
                        Welcome to Admin Page
                    </h4>
                    <ol
                        className="breadcrumb d-flex justify-content-center mb-0 wow fadeInDown"
                        data-wow-delay="0.3s"
                    >
                        <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="#">Pages</a>
                        </li>
                        <li className="breadcrumb-item active text-primary">
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ol>
                </div>
            </div> */}
      {/* Header End */}
    </>
  );
}

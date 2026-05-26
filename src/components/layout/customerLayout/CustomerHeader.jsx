import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactModal from "react-modal";
import { login } from "../../../services/userService";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        width: "40%",
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        zIndex: 9999
    }
};

export default function CustomerHeader() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('')
    let [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('')

    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const getEmail = (e) => {
        setEmail(e.target.value);
    }
    const getPassword = (e) => {
        setPassword(e.target.value);
    }

    const nav = useNavigate()
    const logout = (e) => {
        e.preventDefault()
        toast.success("Logout Successfully")
        localStorage.clear()
        nav('/login')
    }

    const submit = (e) => {
        e.preventDefault()
        console.log("hello");

        setLoading(true)
        let payload = {
            email: email,
            password: password
        }
        login(payload).then((res) => {
            if (res.data.success) {
                setLoading(false)
                toast.success(res.data.message)
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("email", res.data.data.email)
                localStorage.setItem("name", res.data.data.name)
                localStorage.setItem("_id", res.data.data._id)
                localStorage.setItem("userType", res.data.data.userType)
                if (res.data.data.userType == 1) {
                    nav("/admin/dashboard")
                }
                else if (res.data.data.userType == 2) {
                    nav("/trainer/dashboard")
                }
                else if (res.data.data.userType == 3) {
                    nav("/")
                }
                else {
                    toast.error("Invalid user type")
                }
            } else {
                setLoading(false)
                toast.error(res.data.message)
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err);
            toast.error(err)
        })
    }
    return (
        <>
              <ReactModal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(5px)",
      zIndex: 999,
    },
    content: {
      width: "55%",
      maxWidth: "650px",
      height: "550px",
      margin: "auto",
      padding: "0",
      border: "none",
      borderRadius: "18px",
      overflow: "hidden",
      background: "#07154A",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      animation: "popupZoom 0.4s ease",
    },
  }}
  contentLabel="Login Modal"
>
  <div
    className="form-section p-5 position-relative"
    style={{
      background: "#07154A",
    }}
  >

    {/* Close Button */}
 <button
  onClick={closeModal}
  style={{
    position: "absolute",
    top: "10px",
    right: "15px",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    cursor: "pointer",
    fontSize: "28px",
    color: "#00d4ff",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s ease",
    boxShadow: "0 0 10px rgba(0,212,255,0.4)"
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "#00d4ff";
    e.target.style.color = "#001f3f";
    e.target.style.transform = "rotate(90deg) scale(1.1)";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "rgba(255,255,255,0.08)";
    e.target.style.color = "#00d4ff";
    e.target.style.transform = "rotate(0deg) scale(1)";
  }}
>
  <i className="bi bi-x"></i>
</button>

    {/* Heading */}
    <h1
      className="text-white text-center mb-5"
      style={{
        fontWeight: "700",
        fontSize: "55px",
        letterSpacing: "1px",
      }}
    >
      Login
    </h1>

    <form onSubmit={submit}>
      <div className="row g-4">

        {/* Email */}
        <div className="col-12">
          <div className="form-floating">
            <input
              type="email"
              className="form-control border-0"
              id="email"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{
                height: "65px",
                borderRadius: "12px",
                background: "#f4f4f4",
                fontSize: "17px",
                boxShadow: "none",
              }}
            />
            <label htmlFor="email">Enter Email</label>
          </div>
        </div>

        {/* Password */}
        <div className="col-12">
          <div className="form-floating">
            <input
              type="password"
              className="form-control border-0"
              id="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                height: "65px",
                borderRadius: "12px",
                background: "#f4f4f4",
                fontSize: "17px",
                boxShadow: "none",
              }}
            />
            <label htmlFor="password">Enter Password</label>
          </div>
        </div>

        {/* Checkbox */}
        <div className="col-12">
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheck"
              style={{
                cursor: "pointer",
              }}
            />

            <label
              className="form-check-label text-light"
              htmlFor="flexCheck"
              style={{
                fontSize: "15px",
                opacity: "0.9",
              }}
            >
              I agree with the site privacy policy
            </label>
          </div>
        </div>

        {/* Button */}
        <div className="col-12 mt-4">
          <button
            className="w-100 border-0"
            type="submit"
            style={{
              background: "#e6004c",
              color: "#fff",
              height: "60px",
              borderRadius: "12px",
              fontSize: "20px",
              fontWeight: "600",
              letterSpacing: "1px",
              transition: "0.3s",
              boxShadow: "0 5px 20px rgba(230,0,76,0.4)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.background = "#ff0055";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px)";
              e.target.style.background = "#e6004c";
            }}
          >
            LOGIN
          </button>
        </div>
      </div>
    </form>
  </div>

  {/* Animation */}
  <style>
    {`
      @keyframes popupZoom {
        from {
          opacity: 0;
          transform: scale(0.7);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}
  </style>
</ReactModal>

            {/* Navbar & Hero Start */}
            <div className="container-fluid header-top">
                <div className="nav-shaps-2" />
                <div className="container d-flex align-items-center">
                    <div className="d-flex align-items-center h-100">
                        <a href="#" className="navbar-brand" style={{ height: 125 }}>
                            <h1 className="mb-0" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                <i className="fas fa-dumbbell text-danger" />
                                <span style={{ fontWeight: 900, letterSpacing: '2px', color: 'white' }}>FIT-MATRIX</span>
                            </h1>
                            {/* <img src="img/logo.png" alt="Logo"> */}
                        </a>
                    </div>
                    <div className="w-100 h-100">
                        <div
                            className="topbar px-0 py-2 d-none d-lg-block"
                            style={{ height: 45 }}
                        >
                            <div className="row gx-0 align-items-center">
                                <div className="col-lg-8 text-center text-lg-center mb-lg-0">
                                    <div className="d-flex flex-wrap">
                                        <div className="pe-4">
                                            <a
                                                href="mailto:example@gmail.com"
                                                className="text-muted small"
                                            >
                                                <i className="fas fa-envelope text-primary me-2" />
                                                Fitmatrix@gmail.com
                                            </a>
                                        </div>
                                        <div className="pe-0">
                                            <a
                                                href="mailto:example@gmail.com"
                                                className="text-muted small"
                                            >
                                                <i className="fa fa-clock text-primary me-2" />
                                                OPEN 24 hours, 7 days a week!
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 text-center text-lg-end">
                                    <div className="d-flex justify-content-end">


                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="nav-bar px-0 py-lg-0" style={{ height: 80 }}>
                            <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-lg-end">
                                <a href="#" className="navbar-brand-2">
                                    <h1 className="mb-0" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                        <i className="fas fa-dumbbell text-danger" />
                                        <span style={{ fontWeight: 900, letterSpacing: '2px', color: 'white' }}>FITMATRIX</span>
                                    </h1>
                                    {/* <img src="img/logo.png" alt="Logo"> */}
                                </a>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#navbarCollapse"
                                >
                                    <span className="fa fa-bars" />
                                </button>
                                <div className="collapse navbar-collapse" id="navbarCollapse">
                                    <div className="navbar-nav mx-0 mx-lg-auto">
                                        <Link to="/" className="nav-item nav-link">Home</Link>
                                        <Link to="/about" className="nav-item nav-link">About</Link>
                                        {/* <Link to="/courses" className="nav-item nav-link">Courses</Link> */}
                                        <Link to="/bmi-calculator" className="nav-item nav-link">BMI</Link>
                                        {localStorage.getItem("token") && (
                                            <Link to="/batches" className="nav-item nav-link">Batches</Link>
                                        )}
                                        {localStorage.getItem("token") && (
                                            <div className="nav-item dropdown">
                                                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">My Fitness</a>
                                                <div className="dropdown-menu">
                                                    <Link to="/customer/diet" className="dropdown-item"> Diet</Link>
                                                    <Link to="/customer/exercises" className="dropdown-item"> Exercises</Link>
                                                    <Link to="/customer/progress" className="dropdown-item"> Progress</Link>
                                                    <Link to="/ai-coach" className="dropdown-item">AI Coach</Link>
                                                </div>
                                            </div>
                                        )}

                                        {/* <div className="nav-item dropdown">
                                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                                            <div className="dropdown-menu">
                                                <Link to="/feature" className="dropdown-item">Our Features</Link>
                                                <Link to="/team" className="dropdown-item">Our Team</Link>
                                                <Link to="/testimonial" className="dropdown-item">Testimonial</Link>
                                                <Link to="/FOF" className="dropdown-item">404 Page</Link>
                                            </div>
                                        </div> */}

                                        <Link to="/contact" className="nav-item nav-link">Contact</Link>

                                        {/* ✅ Manage Profile - RIGHT AFTER Contact, only when logged in */}
                                        {localStorage.getItem("token") && (
                                            <div className="nav-item dropdown">
                                                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                                    Manage Profile
                                                </a>
                                                <div className="dropdown-menu">
                                                    <Link to="/customer/update/:_id" className="dropdown-item">Update Profile</Link>
                                                    <Link to="/customer/changePassword" className="dropdown-item">Change Password</Link>
                                                </div>
                                            </div>
                                        )}

                                        {/* Login/Logout Buttons */}
                                        <div className="d-flex ms-lg-auto align-items-center">
                                            {localStorage.getItem("token") ? (
                                                <div className="nav-btn ps-3">
                                                    <button className="btn btn-primary py-2 px-3" onClick={logout}>
                                                        LOGOUT
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="nav-btn ps-3">
                                                        <Link to="/register" className="btn btn-primary py-2 px-2">
                                                            <span>REGISTER</span>
                                                        </Link>
                                                    </div>
                                                    <div className="nav-btn ps-3">
                                                        <button className="btn btn-primary py-2 px-3" onClick={openModal}>
                                                            <span>LOGIN</span>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="nav-shaps-1" />
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* Navbar & Hero End */}
        </>
    )
}

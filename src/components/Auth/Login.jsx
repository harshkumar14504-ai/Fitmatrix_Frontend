import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/userService";
import { RingLoader } from "react-spinners"

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function Login() {
    let [color, setColor] = useState("#eb0c1b");
    let [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const getName = (e) => {
        setName(e.target.value);
    }
    const getEmail = (e) => {
        setEmail(e.target.value);
    }
    const getPassword = (e) => {
        setPassword(e.target.value);
    }


    const nav = useNavigate()

    useEffect(() => {
        let token = localStorage.getItem("token")
        let userType = localStorage.getItem("userType")
        if (token && userType) {
            if (userType == 1) {
                nav("/admin/dashboard")
            }
            else if (userType == 2) {
                nav("/trainer/dashboard")
            }
            else if (userType == 3) {
                nav("/")
            }
        }
    })

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)
        let payload = {
            email: email.trim(),
            password: password.trim()
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
                    localStorage.setItem("trainerId", res.data.data.trainerId)

                    nav("/trainer/dashboard")
                }
                else if (res.data.data.userType == 3) {
                    nav("/")
                }
                else {
                    setLoading(false)
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

        // if (name== "Admin" && email == "admin@gmail.com" && password == "1234") {
        //     localStorage.setItem("email", email)
        //     localStorage.setItem("isLoggedIn", true)
        //     toast.success("Login Successfully")
        //     nav("/admin/users/manage")
        // }
        // else if (name=="Saksham" && email == "saksham@gmail.com" && password == "1234") {
        //     localStorage.setItem("email", email)
        //     localStorage.setItem("isLoggedIn", true)
        //     toast.success("Login Successfully")
        //     nav("/")
        // }
        // else if (name=="Trainer" && email == "trainer@gmail.com" && password == "1234") {
        //     localStorage.setItem("email", email)
        //     localStorage.setItem("isLoggedIn", true)
        //     toast.success("Login Successfully")
        //     nav("/trainer/users/manage")
        // }
        // else{
        //     toast.error("Invalid email or password")
        // }

    }
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
            {/* Header Start */}
         
            {/* Header End */}
{/* Contact Start */}
           <div className="container-xxl py-5">
                     <RingLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={100}
                />
                    <div className="container">
                        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                            <h6 className="section-title bg-white text-center text-primary px-3">
                                Login
                            </h6>

                        </div>
                        <div className="row g-4">


                            <div className="col-lg-6 offset-lg-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                                <form onSubmit={submit}>
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email" value={email}
                                                    placeholder="Your Email"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />

                                              
                                                <label htmlFor="email">Your Email</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="subject"
                                                    placeholder="Password" value={password}
                                                    onChange={(e) => setPassword(e.target.value)}

                                                />

                                               
                                                <label htmlFor="subject">Password</label>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3" type="submit" >
                                                Login
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            {/* Contact End */}
        </>
    )
}

import { Profiler, useState } from "react";
// import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../services/userService"

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('')
    const [address, setAddress] = useState('')
    const [age, setAge] = useState('')
    const [goal, setGoal] = useState('')
    const [image, setProfile] = useState(null)



    const nav = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        console.log("Hit");

        let formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("gender", gender)
        formData.append("phone", phone)
        formData.append("address", address)
        formData.append("image", image)
        formData.append("age", age)
        formData.append("goal", goal)




        //with Backend but (without photo upload)
        // let formData = {
        //     name: name,
        //     phone: phone,
        //     email: email,
        //     password: password,
        //     gender: gender,
        //     address: address,
        // }
        register(formData).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message)
                nav("/login")
            }
            else {
                toast.error(res.data.message)
            }
        }).catch((err) => {
            console.log(err);
            toast.error(err)
        })


        //without backend ....we use thius in frontend
        // if (name == "Admin" && email == "admin@gmail.com" && password == "1234") {
        //     localStorage.setItem("email", email)
        //     localStorage.setItem("isLoggedIn", true)
        //     toast.success("Login Successfully")
        //     nav("/admin/users/manage")
        // }
        // else if (name == "Saksham" && email == "saksham@gmail.com" && password == "1234") {
        //     localStorage.setItem("email", email)
        //     localStorage.setItem("isLoggedIn", true)
        //     toast.success("Login Successfully")
        //     nav("/")
        // }
        // else if (name == "Trainer" && email == "trainer@gmail.com" && password == "1234") {
        //     localStorage.setItem("email", email)
        //     localStorage.setItem("isLoggedIn", true)
        //     toast.success("Login Successfully")
        //     nav("/trainer/users/manage")
        // }
        // else {
        //     toast.error("Invalid email or password")
        // }

    }
    return (
        <>


            {/* Contact Start */}

            <div
                className="offset-lg-2 col-lg-8 offset-lg-2 wow fadeInRight my-3"
                data-wow-delay="0.4s"
            >
                <div
                    className="form-section p-4 position-relative h-100"
                    style={{
                        background: "#07154A",
                        borderRadius: "20px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        overflow: "hidden",
                    }}
                >
                    <h1
                        className="text-white text-center mb-4"
                        style={{
                            fontWeight: "700",
                            fontSize: "45px",
                            letterSpacing: "1px",
                        }}
                    >
                        Register
                    </h1>

                    <form>
                        <div className="row g-3">

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control border-0"
                                        id="name"
                                        value={name}
                                        placeholder="Your Name"
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="name">Enter Name</label>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control border-0"
                                        id="phone"
                                        value={phone}
                                        placeholder="Phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="phone">Enter Phone</label>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="email"
                                        className="form-control border-0"
                                        id="email"
                                        value={email}
                                        placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="email">Enter Email</label>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="password"
                                        className="form-control border-0"
                                        id="password"
                                        value={password}
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="password">Enter Password</label>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control border-0"
                                        id="age"
                                        value={age}
                                        placeholder="Age"
                                        onChange={(e) => setAge(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="age">Enter Age</label>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select
                                        className="form-control border-0"
                                        id="goal"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    >
                                        <option value="">Select Goal</option>
                                        <option value="Fat Loss">Fat Loss</option>
                                        <option value="Muscle Gain">Muscle Gain</option>
                                        <option value="Strength Training">Strength Training</option>
                                        <option value="General Fitness">General Fitness</option>
                                    </select>

                                    <label htmlFor="goal">Enter Goal</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <input
                                    type="file"
                                    className="form-control border-0"
                                    id="file"
                                    placeholder="Upload Image"
                                    onChange={(e) => setProfile(e.target.files[0])}
                                    style={{
                                        height: "58px",
                                        borderRadius: "10px",
                                        background: "#f4f4f4",
                                        fontSize: "16px",
                                        paddingTop: "14px",
                                    }}
                                />
                            </div>

                            <div className="col-12">
                                <div className="form-floating">
                                    <select
                                        className="form-control border-0"
                                        id="gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    <label htmlFor="gender">Select Gender</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-floating">
                                    <textarea
                                        type="text"
                                        className="form-control border-0"
                                        id="address"
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        style={{
                                            height: "95px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    ></textarea>

                                    <label htmlFor="address">Address</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-check text-white">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue="#"
                                        id="flexCheck"
                                    />
                                    <label className="form-check-label" htmlFor="flexCheck">
                                        I agree with the site privacy policy
                                    </label>
                                </div>
                            </div>

                            <div className="col-12 mt-3">
                                <button
                                    className="w-100 border-0"
                                    type="submit"
                                    onClick={submit}
                                    style={{
                                        background: "#e6004c",
                                        color: "#fff",
                                        height: "55px",
                                        borderRadius: "10px",
                                        fontSize: "18px",
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
                                    REGISTER
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
            {/* Contact End */}
        </>

    )
}
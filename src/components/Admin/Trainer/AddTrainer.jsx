import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { addTrainers } from "../../../services/trainerService"

export default function AddTrainer() {

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('')
    const [speacilization, setSpeacilization] = useState('')
    const [about, setAbout] = useState('')
    const [image, setImage] = useState('')
    
    const nav = useNavigate()
    const submit = (e) => {
        e.preventDefault()
        console.log("form submitted");
        let formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("phone", phone)
        formData.append("experience", experience)
        formData.append("speacilization", speacilization)
        formData.append("about", about)
        formData.append("image", image)
        addTrainers(formData).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message)
                nav("/admin/trainer/manage")

            }
            else {
                toast.error(res.data.message)
            }
        }).catch((err) => {
            console.log(err);
            toast.error(err)
        })


    }

    return (
        <>
            {/* Header Start */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                Add Trainer
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Dashboard
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Categories
                                        </a>
                                    </li>

                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
            {/* Service Start */}
    <div
    className="offset-lg-2 col-lg-8 offset-lg-2 wow fadeInRight my-4"
    data-wow-delay="0.4s"
>
    <div
        className="form-section p-4 position-relative h-100"
        style={{
            background: "#07154A",
            borderRadius: "22px",
            boxShadow: "0 10px 38px rgba(0,0,0,0.5)",
            overflow: "hidden",
        }}
    >
        <h1
            className="text-white text-center mb-4"
            style={{
                fontWeight: "700",
                fontSize: "40px",
                letterSpacing: "1px",
            }}
        >
            Add Trainer
        </h1>

        <form onSubmit={submit}>
            <div className="row g-3">

                {/* Trainer Name */}
                <div className="col-lg-6">
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control border-0 px-3"
                            id="name"
                            placeholder="Trainer Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                height: "58px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "15px",
                            }}
                        />
                        <label htmlFor="name">Trainer Name</label>
                    </div>
                </div>

                {/* Trainer Contact */}
                <div className="col-lg-6">
                    <div className="form-floating">
                        <input
                            type="number"
                            className="form-control border-0 px-3"
                            id="phone"
                            placeholder="Trainer Contact"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{
                                height: "58px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "15px",
                            }}
                        />
                        <label htmlFor="phone">Trainer Contact</label>
                    </div>
                </div>

                {/* Trainer Email */}
                <div className="col-lg-6">
                    <div className="form-floating">
                        <input
                            type="email"
                            className="form-control border-0 px-3"
                            id="email"
                            placeholder="Trainer Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                height: "58px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "15px",
                            }}
                        />
                        <label htmlFor="email">Trainer Email</label>
                    </div>
                </div>

                {/* Password */}
                <div className="col-lg-6">
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control border-0 px-3"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                height: "58px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "15px",
                            }}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                </div>

                {/* Experience */}
                <div className="col-lg-6">
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control border-0 px-3"
                            id="experience"
                            placeholder="Experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            style={{
                                height: "58px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "15px",
                            }}
                        />
                        <label htmlFor="experience">Experience</label>
                    </div>
                </div>

                {/* Specialization */}
                <div className="col-lg-6">
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control border-0 px-3"
                            id="specialization"
                            placeholder="Specialization"
                            value={speacilization}
                            onChange={(e) => setSpeacilization(e.target.value)}
                            style={{
                                height: "58px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "15px",
                            }}
                        />
                        <label htmlFor="specialization">Specialization</label>
                    </div>
                </div>

                {/* Upload Image */}
                <div className="col-12">
                    <input
                        type="file"
                        className="form-control border-0 px-3"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={{
                            height: "58px",
                            borderRadius: "12px",
                            background: "#f4f4f4",
                            fontSize: "15px",
                            paddingTop: "14px",
                        }}
                    />
                </div>

                {/* About */}
                <div className="col-12">
                    <div className="form-floating">
                        <textarea
                            className="form-control border-0 px-3 py-3"
                            id="about"
                            placeholder="About"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            style={{
                                height: "110px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "15px",
                            }}
                        ></textarea>

                        <label htmlFor="about">About Trainer</label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-12 mt-3">
                    <button
                        className="w-100 border-0"
                        type="submit"
                        style={{
                            background: "#e6004c",
                            color: "#fff",
                            height: "54px",
                            borderRadius: "12px",
                            fontSize: "17px",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            transition: "0.3s",
                            boxShadow: "0 5px 18px rgba(230,0,76,0.4)",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.background = "#ff0055";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0px)";
                            e.target.style.background = "#e6004c";
                        }}
                    >
                        ADD TRAINER
                    </button>
                </div>

            </div>
        </form>
    </div>
</div>

            {/* Team End */}
        </>
    )
}

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { singleTrainer, updateTrainers } from "../../../services/trainerService"

export default function UpdateTrainer() {

    const params = useParams()
    const _id = params._id
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('')
    const [speacilization, setSpeacilization] = useState('')
    const [about, setAbout] = useState('')
    const [image, setImage] = useState('')
    const [address, setAddress] = useState('')
    const nav = useNavigate()


    useEffect(() => {
        getSingleTrainer()
    }, [])


    const getSingleTrainer = () => {
        singleTrainer({ _id: _id }).then((res) => {
            if (res.data.success) {
                setName(res.data.data.name)
                setExperience(res.data.data.experience)
                setEmail(res.data.data.email)
                setPhone(res.data.data.phone)
                setAddress(res.data.data.address)
                setAbout(res.data.data.about)
                setPassword(res.data.data.password)
                setSpeacilization(res.data.data.speacilization)
                setImage(res.data.data.image)
            }
            else {
                toast.error(res.data.message)
            }

        }).catch((err) => {
            console.log(err);
            toast.error(err)
        })

    }
    const submit = (e) => {
        e.preventDefault()
        console.log("form submitted");
        let formData = new FormData()
        formData.append("_id", _id)
        formData.append("name", name)
        formData.append("email", email)
        formData.append("image", image)
        formData.append("phone", phone)
        formData.append("address", address)
        formData.append("experience", experience)
        formData.append("speacilization", speacilization)


        console.log(_id)

        updateTrainers(formData).then((res) => {
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
                                Update Trainer
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
    className="col-lg-8 offset-lg-2 wow fadeInRight my-4"
    data-wow-delay="0.4s"
>
    <div
        className="form-section p-5 h-100"
        style={{
            background: "#07154A",
            borderRadius: "24px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        }}
    >
        <h1 className="display-6 text-white mb-5 text-center fw-bold">
            Update Trainer
        </h1>

        <form onSubmit={submit}>
            <div className="row g-4">

                {/* Trainer Name */}
                <div className="col-md-6">
                    <div className="form-floating form-section-col">
                        <input
                            type="text"
                            className="form-control border-0"
                            id="name"
                            placeholder="Trainer Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                              style={{
                                height: "58px",
                                borderRadius: "10px",
                                background: "#f4f4f4",
                                fontSize: "16px",
                            }}
                        />
                        <label htmlFor="name">Trainer Name</label>
                    </div>
                </div>

                {/* Contact */}
                <div className="col-md-6">
                    <div className="form-floating form-section-col">
                        <input
                            type="number"
                            className="form-control border-0"
                            id="phone"
                            placeholder="Trainer Contact"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                              style={{
                                height: "58px",
                                borderRadius: "10px",
                                background: "#f4f4f4",
                                fontSize: "16px",
                            }}
                        />
                        <label htmlFor="phone">Trainer Contact</label>
                    </div>
                </div>

                {/* Email */}
                <div className="col-md-6">
                    <div className="form-floating form-section-col">
                        <input
                            type="email"
                            className="form-control border-0"
                            id="email"
                            placeholder="Trainer Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                              style={{
                                height: "58px",
                                borderRadius: "10px",
                                background: "#f4f4f4",
                                fontSize: "16px",
                            }}
                        />
                        <label htmlFor="email">Trainer Email</label>
                    </div>
                </div>

                {/* Experience */}
                <div className="col-md-6">
                    <div className="form-floating form-section-col">
                        <input
                            type="text"
                            className="form-control border-0"
                            id="experience"
                            placeholder="Experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                              style={{
                                height: "58px",
                                borderRadius: "10px",
                                background: "#f4f4f4",
                                fontSize: "16px",
                            }}
                        />
                        <label htmlFor="experience">Experience</label>
                    </div>
                </div>

                {/* Specialization */}
                <div className="col-md-6">
                    <div className="form-floating form-section-col">
                        <input
                            type="text"
                            className="form-control border-0"
                            id="specialization"
                            placeholder="Specialization"
                            value={speacilization}
                            onChange={(e) =>
                                setSpeacilization(e.target.value)

                            }
                              style={{
                                height: "58px",
                                borderRadius: "10px",
                                background: "#f4f4f4",
                                fontSize: "16px",
                            }}
                        />
                        <label htmlFor="specialization">
                            Specialization
                        </label>
                    </div>
                </div>

                {/* Image */}
                <div className="col-md-6">
                    <div className="form-floating form-section-col">
                        <input
                            type="file"
                            className="form-control border-0"
                            id="image"
                            onChange={(e) => setImage(e.target.files[0])}
                              style={{
                                height: "58px",
                                borderRadius: "10px",
                                background: "#f4f4f4",
                                fontSize: "16px",
                            }}
                        />
                        <label htmlFor="image">Trainer Image</label>
                    </div>
                </div>

                {/* About */}
                <div className="col-12">
                    <div className="form-floating form-section-col">
                        <textarea
                            className="form-control"
                            id="about"
                            placeholder="About"
                            style={{ height: "130px" }}
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                              style={{
                                height: "58px",
                                borderRadius: "10px",
                                background: "#f4f4f4",
                                fontSize: "16px",
                            }}
                        ></textarea>
                        <label htmlFor="about">About Trainer</label>
                    </div>
                </div>

                {/* Submit */}
                <div className="col-12 mt-3">
                    <div className="form-section-col">
                        <button
                            className="btn btn-primary w-100 py-3 fw-semibold"
                            type="submit"
                            style={{
                                borderRadius: "12px",
                                fontSize: "17px",
                            }}
                        >
                            Update Trainer
                        </button>
                    </div>
                </div>

            </div>
        </form>
    </div>
</div>

            {/* Team End */}
        </>
    )
}

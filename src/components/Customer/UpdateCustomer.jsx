import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
// import { singleCustomer, updateCustomer } from "../../../services/trainerService"
import { singleCustomer, updateCustomer } from "../../services/customerService"

export default function UpdateCustomer() {

    const params = useParams()
    const _id = params._id
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    const [gender, setGender] = useState('')
    const [goal, setGoal] = useState('')
    const [about, setAbout] = useState('')
    const [image, setImage] = useState('')
    const [address, setAddress] = useState('')
    const nav = useNavigate()


    useEffect(() => {
        getSingleCustomer()
    }, [])


    const getSingleCustomer = () => {
        singleCustomer({ _id: localStorage.getItem("_id") }).then((res) => {
            if (res.data.success) {
                setName(res.data.data.name)
                setGender(res.data.data.gender)
                // setEmail(res.data.data.email)
                setPhone(res.data.data.phone)
                setAddress(res.data.data.address)
                setAbout(res.data.data.about)
                // setPassword(res.data.data.password)
                setGoal(res.data.data.speacilization)
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
        formData.append("_id", localStorage.getItem("_id"))
        formData.append("name", name)
        // formData.append("email", email)
        formData.append("image", image)
        formData.append("phone", phone)
        formData.append("address", address)
        formData.append("gender", gender)

        console.log(_id)

        updateCustomer(formData).then((res) => {
            if (res.data.success) {

                toast.success(res.data.message)
                nav("/")

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
         
            {/* Service Start */}
          <div
    className="col-lg-6 offset-lg-3 wow fadeInRight my-4"
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
        <h1
            className="display-5 text-white mb-5 text-center"
            style={{
                fontWeight: "700",
                letterSpacing: "1px",
            }}
        >
            Update Profile
        </h1>

        <form onSubmit={submit}>
            <div className="row g-4">

                {/* Name */}
                <div className="col-lg-12 col-xl-6">
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control border-0"
                            id="name"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                height: "65px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
                            }}
                        />
                        <label htmlFor="name">Your Name</label>
                    </div>
                </div>

                {/* Phone */}
                <div className="col-lg-12 col-xl-6">
                    <div className="form-floating">
                        <input
                            type="number"
                            className="form-control border-0"
                            id="phone"
                            placeholder="Your Contact"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{
                                height: "65px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
                            }}
                        />
                        <label htmlFor="phone">Your Contact</label>
                    </div>
                </div>

                {/* Gender */}
                <div className="col-lg-12 col-xl-6">
                    <div className="form-floating">
                        <select
                            className="form-control border-0"
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            style={{
                                height: "65px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
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

                {/* File Upload */}
                <div className="col-lg-12 col-xl-6">
                    <div className="form-floating">
                        <input
                            type="file"
                            className="form-control border-0"
                            id="image"
                            placeholder="Your Image"
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{
                                height: "65px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
                                paddingTop: "18px",
                            }}
                        />
                        {/* <label htmlFor="image">Your Image</label> */}
                    </div>
                </div>

                {/* Address */}
                <div className="col-12">
                    <div className="form-floating">
                        <textarea
                            className="form-control border-0"
                            id="address"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                                height: "170px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
                            }}
                        ></textarea>
                        <label htmlFor="address">Address</label>
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
                        Update
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

import { Link } from "react-router-dom";
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { addContact, updateContact } from "../../services/contactService";
import { useState } from "react";


export default function Contact() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const nav = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        console.log("Hit");

        let formData = {
            name,
            email,
            phone,
            subject,
            message
        }

        addContact(formData)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message)
                    nav("/contact")
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error("Something went wrong")
            })
    }

    // updateContact(formData).then((res) => {
    //     if (res.data.success) {

    //         toast.success(res.data.message)
    //         nav("/contact")

    //     }
    //     else {
    //         toast.error(res.data.message)
    //     }
    // }).catch((err) => {
    //     console.log(err);
    //     toast.error(err)
    // })

    return (
        <>
        
         
            {/* Contact Start */}
         <div className="container-fluid contact py-5">
  <div className="container py-5">
    <div className="row g-5">

      {/* Left Side */}
      <div className="col-lg-6 wow fadeInLeft">
        <div className="mb-4">

          <h4 className="text-primary">Contact Us</h4>

          <h1 className="display-4 mb-4">
            Get in Touch with FitMatrix
          </h1>

          <p className="mb-4">
            Have questions or need assistance? Reach out to us for memberships,
            training plans, or any fitness-related queries. We're here to help you
            achieve your goals.
          </p>

          <div className="row g-4">

            {/* Address */}
            <div className="col-lg-6">
              <div
                className="bg-white d-flex p-4 h-100"
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >
                <i className="fas fa-map-marker-alt fa-2x text-primary me-3" />
                <div>
                  <h4>Address</h4>
                  <p className="mb-0">
                    Hoshiarpur, Punjab, India - 146001
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="col-lg-6">
              <div
                className="bg-white d-flex p-4 h-100"
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >
                <i className="fas fa-envelope fa-2x text-primary me-3" />
                <div>
                  <h4>Email</h4>
                  <p className="mb-0">
                    harshkumar14504@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="col-lg-6">
              <div
                className="bg-white d-flex p-4 h-100"
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >
                <i className="fa fa-phone-alt fa-2x text-primary me-3" />
                <div>
                  <h4>Phone</h4>
                  <p className="mb-0">
                    +91 94780 12693
                  </p>
                </div>
              </div>
            </div>

            {/* Website */}
            <div className="col-lg-6">
              <div
                className="bg-white d-flex p-4 h-100"
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >
                <i className="fas fa-globe fa-2x text-primary me-3" />
                <div>
                  <h4>Website</h4>
                  <p className="mb-0">
                    www.fitmatrix.com
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Social */}
        <div className="d-flex flex-wrap gap-3 mb-5">

          <a
            className="btn"
            href="#"
            style={{
              background: "#07154A",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 22px",
              fontWeight: "600",
            }}
          >
            Facebook <i className="fas fa-chevron-circle-right ms-2" />
          </a>

          <a
            className="btn"
            href="#"
            style={{
              background: "#07154A",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 22px",
              fontWeight: "600",
            }}
          >
            Twitter <i className="fas fa-chevron-circle-right ms-2" />
          </a>

          <a
            className="btn"
            href="#"
            style={{
              background: "#07154A",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 22px",
              fontWeight: "600",
            }}
          >
            Instagram <i className="fas fa-chevron-circle-right ms-2" />
          </a>

        </div>

        {/* Banner */}
        <div
          className="contact-banner"
          style={{
            background: "#07154A",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div className="row g-0">
            <div className="col-12">
              <div className="p-4">
                <h4 className="display-6 text-white mb-3">
                  Want to Join FitMatrix?
                </h4>

                <a
                  href="#"
                  className="h5 mb-0"
                  style={{
                    color: "#ff0055",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Start Your Fitness Journey
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Side Form */}
      <div className="col-lg-6 wow fadeInRight">
        <div
          className="form-section p-5 position-relative h-100"
          style={{
            background: "#07154A",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Heading */}
          <h1
            className="text-white text-center mb-5"
            style={{
              fontWeight: "700",
              fontSize: "55px",
              letterSpacing: "1px",
            }}
          >
            Get In Touch
          </h1>

          <form onSubmit={submit}>
            <div className="row g-4">

              {/* Name */}
              <div className="col-lg-12 col-xl-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Your Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    style={{
                      height: "65px",
                      borderRadius: "12px",
                      background: "#f4f4f4",
                      fontSize: "17px",
                    }}
                  />
                  <label>Your Name</label>
                </div>
              </div>

              {/* Email */}
              <div className="col-lg-12 col-xl-6">
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control border-0"
                    placeholder="Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    style={{
                      height: "65px",
                      borderRadius: "12px",
                      background: "#f4f4f4",
                      fontSize: "17px",
                    }}
                  />
                  <label>Your Email</label>
                </div>
              </div>

              {/* Phone */}
              <div className="col-lg-12 col-xl-6">
                <div className="form-floating">
                  <input
                    type="tel"
                    className="form-control border-0"
                    placeholder="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    style={{
                      height: "65px",
                      borderRadius: "12px",
                      background: "#f4f4f4",
                      fontSize: "17px",
                    }}
                  />
                  <label>Your Phone</label>
                </div>
              </div>

              {/* Subject */}
              <div className="col-lg-12 col-xl-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Subject"
                    onChange={(e) => setSubject(e.target.value)}
                    value={subject}
                    style={{
                      height: "65px",
                      borderRadius: "12px",
                      background: "#f4f4f4",
                      fontSize: "17px",
                    }}
                  />
                  <label>Subject</label>
                </div>
              </div>

              {/* Message */}
              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    className="form-control border-0"
                    placeholder="Message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    style={{
                      height: "170px",
                      borderRadius: "12px",
                      background: "#f4f4f4",
                      fontSize: "17px",
                    }}
                  />
                  <label>Your Message</label>
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
                  SEND MESSAGE
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="col-12 wow fadeInUp">
        <div
          className="h-100 overflow-hidden"
          style={{
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          <iframe
            className="w-100"
            style={{ height: 400, border: 0 }}
            src="https://www.google.com/maps?q=Hoshiarpur,Punjab,India&output=embed"
            loading="lazy"
          />
        </div>
      </div>

    </div>
  </div>
</div>
            {/* Contact End */}
        </>

    )
}
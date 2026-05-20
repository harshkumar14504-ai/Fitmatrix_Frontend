import { Link } from "react-router-dom";
import ChatBot from "react-chatbotify";
import { BASE_URL } from "../../../endPoints";

export default function TrainerFooter() {

  const flow = {
    start: {
      message: "Welcome to FitLab Trainer 💪! Ask me anything about fitness.",
      path: "chat"
    },
    chat: {
      message: async (params) => {
        try {
          const res = await fetch(BASE_URL + "customer/genAi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: params.userInput })
          });
          const data = await res.json();
          return data?.data || "No response from AI";
        } catch (error) {
          return "Server error. Try again.";
        }
      },
      path: "chat"
    }
  };

  return (
    <>
      {/* Footer Start */}
      <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
        <div className="container py-5">
              <div className="row g-5">
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h1 className="mb-0" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-dumbbell text-danger" />
                  <span style={{ fontWeight: 900, letterSpacing: '2px', color: 'white' }}>FITLAB</span>
                </h1>
                <p className="mb-0">
                  Join the FITLAB Gym today and Explore your potential.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">Quick Links</h4>
                <Link to="/"> Home</Link>
                <Link to="/about"> About us</Link>
                <Link to="/courses"> Our Courses</Link>
                <Link to="/feature"> Our Features</Link>
                <Link to="/blogs"> Our Blog &amp; news</Link>
                <Link to="/testimonial"> Testimonial</Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4"> Contact Info</h4>
                <div className="row g-2">
                  <div className="col-12">
                    <div className="d-flex">
                      <i className="fas fa-map-marker-alt text-primary me-2" />
                      <div>
                        <h5 className="text-white mb-2">Address</h5>
                        <p className="mb-0">123 street New York</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex">
                      <i className="fas fa-envelope text-primary me-2" />
                      <div>
                        <h5 className="text-white mb-2">Mail Us</h5>
                        <p className="mb-0">info@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex">
                      <i className="fa fa-phone-alt text-primary me-2" />
                      <div>
                        <h5 className="text-white mb-2">Telephone</h5>
                        <p className="mb-0">(+012) 3456 7890 123</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
      {/* Copyright Start */}
      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 text-center text-md-start mb-md-0">
              <span className="text-body">
                <a href="#" className="border-bottom text-white">
                  <i className="fas fa-copyright text-light me-2" />
                  FITLAB@2026
                </a>
                , All right reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright End */}
      {/* Back to Top */}
      {/* <div className="back-to-top">
        <a href="#" className="btn">
          <i className="fa fa-arrow-up" />
        </a>
      </div> */}
      <ChatBot flow={flow} />
    </>

  )
}
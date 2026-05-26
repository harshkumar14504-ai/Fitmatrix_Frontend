import { Link } from "react-router-dom";
import ChatBot from "react-chatbotify";
import { BASE_URL } from "../../../endPoints";

export default function AdminFooter() {

  const flow = {
    start: {
      message: "Welcome to FitLab Admin 💪! Ask me anything about fitness.",
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
            {/* About */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">
                  <i className="fas fa-dumbbell text-primary me-2" /> FitMatrix
                </h4>
                <p className="mb-0">
                  FitMatrix is a modern fitness platform designed to help you achieve
                  your health goals. Join us for professional training programs,
                  expert guidance, and a healthy lifestyle.
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">Quick Links</h4>
                <a href="#">Home</a>
                <a href="#">About Us</a>
                <a href="#">Programs</a>
                <a href="#">Features</a>
                <a href="#">Blog</a>
                <a href="#">Contact</a>
              </div>
            </div>

            {/* Contact */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">Contact Info</h4>
                <div className="row g-2">

                  <div className="col-12">
                    <div className="d-flex">
                      <i className="fas fa-map-marker-alt text-primary me-2" />
                      <div>
                        <h5 className="text-white mb-2">Address</h5>
                        <p className="mb-0">
                          Hoshiarpur, Punjab, India - 146001
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex">
                      <i className="fas fa-envelope text-primary me-2" />
                      <div>
                        <h5 className="text-white mb-2">Mail Us</h5>
                        <p className="mb-0">
                          harshkumar14504@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex">
                      <i className="fa fa-phone-alt text-primary me-2" />
                      <div>
                        <h5 className="text-white mb-2">Phone</h5>
                        <p className="mb-0">
                          +91 94780 12693
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">Gallery</h4>
                <div className="row g-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                    <div className="col-3" key={index}>
                      <div className="footer-item-img">
                        <a href="#">
                          <img src={`img/work-${item}.jpg`} className="img-fluid" alt="" />
                        </a>
                      </div>
                    </div>
                  ))}
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
                  FitMatrix
                </a>
                , All rights reserved.
              </span>
            </div>

            <div className="col-md-6 text-center text-md-end text-body">
              Developed By{" "}
              <span className="text-white border-bottom">
                Harsh Kumar
              </span>
            </div>

          </div>
        </div>
      </div>
      {/* Copyright End */}
      {/* Back to Top */}
      <div className="back-to-top">
        <a href="#" className="btn">
          <i className="fa fa-arrow-up" />
        </a>
      </div>
      <ChatBot flow={flow} />
    </>


  )
}
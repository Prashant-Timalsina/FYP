import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-10 p-10">
        {/* Left Side - Contact Info */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-4">
            Have questions or need assistance? Get in touch with us!
          </p>
          <div className="text-gray-700">
            <p>
              <strong>Email: &nbsp; </strong>
              <u className="cursor-pointer hover:text-blue-700">
                np03cs4a220102@heraldcollege.edu.np
              </u>
            </p>
            <p>
              <strong>Phone: &nbsp;</strong>{" "}
              <u className="cursor-pointer hover:text-blue-700">
                +977 9800000000
              </u>
            </p>
            <p>
              <strong>Address:&nbsp; </strong>{" "}
              <u className="cursor-pointer hover:text-blue-700">
                Bhagwati Marg, Kathmandu
              </u>
            </p>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="md:w-1/2 w-full bg-gray-100 p-6 rounded-lg shadow-lg">
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="p-3 border border-gray-300 rounded-md"
            ></textarea>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <div className="w-full h-64">
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1248.8114151136592!2d85.33088530718567!3d27.711972737157026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196de5da5741%3A0x652792640c70ede9!2sHerald%20College%20Kathmandu!5e0!3m2!1sen!2snp!4v1738743402630!5m2!1sen!2snp"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          className="rounded-lg shadow-lg border"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;

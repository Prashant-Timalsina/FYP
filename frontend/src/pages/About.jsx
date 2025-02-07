import React from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title.jsx";

const About = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-10 p-10">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <div className="text-base sm:text-2xl mb-4">
            <Title text1={"ABOUT"} text2={"US"} />
          </div>

          <p className="text-gray-600 mb-4">
            Welcome to TimberCraft, your trusted partner in high-quality
            handcrafted furniture. With years of experience in the industry, we
            take pride in designing and delivering premium furniture pieces
            tailored to your needs.
          </p>
          <p className="text-gray-600 mb-8">
            Our journey started with a passion for woodworking, and today, we
            blend craftsmanship with innovation to bring you timeless designs.
            Whether you need custom modifications or stocked furniture, we've
            got you covered.
          </p>
          <hr />

          <div className="mt-6">
            <Title text1={"OUR"} text2={"MISSION"} />
            <p className="text-gray-600">
              To create functional, aesthetic, and durable furniture that
              enhances the beauty of every space while maintaining
              sustainability and quality craftsmanship.
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2 mb-15">
          <img
            src="https://images.unsplash.com/photo-1597072689227-8882273e8f6a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Brown Wooden Table with Chairs"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>

      <div className="text-center border rounded p-4 px-3 mb-5 mt-10 max-w-[400px] mx-auto">
        <Title text1={"Meet"} text2={"Developer"} />
        <div className="w-[80%] mx-auto">
          {" "}
          {/* Adjusted image container width */}
          <img
            src="https://plus.unsplash.com/premium_photo-1738590561029-33c9c5d64af2?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Developer"
            className="w-full rounded-lg"
          />
          <p className="underline font-bold mt-2">Prashant Timalsina</p>
          <p>Full Stack Developer of TimberCraft</p>
        </div>
      </div>
    </div>
  );
};

export default About;

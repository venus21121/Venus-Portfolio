import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import profile from "../assets/profile.jpg";
import ubcLogo from "../assets/ubcLogo.png";

const AboutMe = () => {
  const [activeSection, setActiveSection] = useState("description");

  // Content for each section
  const sections = {
    description: (
      <div className="overview mt-2 text-lg leading-relaxed max-w-3xl mx-auto">
        <p className="mb-4">
          Hello! My name is Venus, and I’m a passionate developer with a strong
          foundation in building innovative projects. I recently graduated with
          a{" "}
          <span className="font-bold text-green">
            Bachelor's of Science in Mathematics
          </span>{" "}
          and a{" "}
          <span className="font-bold text-green">
            minor in Computer Science
          </span>{" "}
          at the University of British Columbia.
        </p>

        <p className="mb-4">
          My journey began with an internship at
          <span className="font-semibold text-green"> Acer</span>, where I
          worked on <span className="italic">machine learning models</span> for
          medical applications. Since then, I’ve participated in a{" "}
          <span className="font-semibold text-green">hackathon</span> that
          fueled my passion for solving complex problems in collaborative
          environments.
        </p>

        <p className="mb-4">
          I’m a hard-working individual who thrives on challenges and is always
          looking for opportunities to improve. When I’m not coding, I enjoy
          hiking and working out, balancing my creative and technical pursuits.
        </p>

        <p>
          I’m excited to connect with others who share a passion for development
          and innovation.
        </p>
      </div>
    ),
    education: (
      <div className="education-container mt-4 flex items-center">
        <img
          src={ubcLogo}
          alt="UBC Logo"
          className="w-16 h-16 mr-4 ml-2 object-contain scale-125 bg-white p-1 rounded-lg"
        />
        <p className="overview">
          <strong className="text-white">
            BSc in Mathematics and Computer Science
          </strong>
          <br />
          University of British Columbia
        </p>
      </div>
    ),
    skills: (
      <div className="skills-container mt-4">
        <ul className="list-disc list-inside overview">
          <li>
            <strong className="text-white">Languages:</strong> JavaScript,
            Python, Java, C++, SQL
          </li>
          <li>
            <strong className="text-white">Web Development:</strong> React,
            Node.js, Express, HTML, CSS, Tailwind CSS
          </li>
          <li>
            <strong className="text-white">Databases:</strong> PostgreSQL,
            MySQL, MongoDB
          </li>
          <li>
            <strong className="text-white">Tools & Frameworks:</strong> Git,
            TensorFlow, Scikit-learn, Flask, Spring Boot
          </li>
        </ul>
      </div>
    ),
  };

  return (
    <div className="section">
      {/* Profile Section */}
      <div className="box about-box flex flex-col p-6 max-w-4xl mx-auto rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-start">
          {/* Profile Image */}
          <div className="photo-container overflow-hidden flex-shrink-0 w-48 h-48 rounded-lg mx-auto">
            <img
              src={profile}
              alt="myProfile"
              className="w-full h-full object-cover transform scale-125 border-2 border-gray-300 rounded-lg"
            />
          </div>

          {/* Profile Info */}
          <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left w-full">
            <h2 className="text-white text-2xl font-bold">Venus Lee</h2>
            <h2 className="text-lightSlate text-2xl font-bold">
              I like to build meaningful things.{" "}
            </h2>
            <p className="overview mt-1 flex items-center justify-center sm:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-green-500 mr-2"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Vancouver, BC
            </p>
          </div>
        </div>

        {/* Navigation Tab Below Profile */}
        <div className="mt-8">
          <div className="flex space-x-8 border-b border-gray-300 pb-4">
            <button
              className={`${
                activeSection === "description"
                  ? "font-bold text-green"
                  : "text-gray-300 hover:text-green"
              } cursor-pointer`}
              onClick={() => setActiveSection("description")}
            >
              About Me
            </button>
            <button
              className={`${
                activeSection === "education"
                  ? "font-bold text-green"
                  : "text-gray-300 hover:text-green"
              } cursor-pointer`}
              onClick={() => setActiveSection("education")}
            >
              Education
            </button>
            <button
              className={`${
                activeSection === "skills"
                  ? "font-bold text-green"
                  : "text-gray-300 hover:text-green"
              } cursor-pointer`}
              onClick={() => setActiveSection("skills")}
            >
              Skills
            </button>
          </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="mt-4">{sections[activeSection]}</div>
        {/* Social Media Icons */}
        <div className="icons flex justify-center sm:justify-start gap-4 mt-8 text-lg">
          <a
            href="https://www.linkedin.com/in/venus-lee-a987121a4/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/venus21121"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-600"
          >
            <FaGithub />
          </a>
          <a
            href="mailto: venus21121@gmail.com"
            className="text-red-600 hover:text-red-800"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;

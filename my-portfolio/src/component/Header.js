import React, { forwardRef } from "react";
import venusIcon from "../assets/venus-icon.png";
const Header = forwardRef(
  (
    { currentSection, setSection, showBackButton, onBackToHome, ...props },
    ref
  ) => {
    return (
      <div className="header-wrapper relative">
        {/* Back Button */}
        {showBackButton && (
          <button
            onClick={onBackToHome}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-full text-green bg-transparent hover:bg-lightNavy rounded-md p-2 transition duration-300 "
          >
            <img
              src={venusIcon}
              alt="Back to Home"
              className=" animate-spin-slow w-12 h-12" // Adjust the size of the icon
            />
          </button>
        )}

        {/* Header Content */}
        <header
          ref={ref}
          {...props}
          className="header-container grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8 text-white mx-auto justify-items-center max-w-screen-xl"
        >
          {["Projects", "Experiences", "AboutMe"].map((section) => (
            <button
              key={section}
              className={`hover:bg-lightNavy px-4 py-2 rounded ${
                currentSection === section
                  ? "border-b-4 border-green text-white"
                  : "text-gray-300"
              }`}
              onClick={() => setSection(section)}
            >
              {section}
            </button>
          ))}
          <a
            className="inline-flex items-center px-4 py-2 text-green border-2 border-green rounded-lg text-base font-medium transition-transform duration-300 hover:-translate-y-1"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 ml-2 transition-transform duration-300 hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 3h7m0 0v7m0-7L10 14m-3 0H4v-7"
              />
            </svg>
          </a>
        </header>
      </div>
    );
  }
);

export default Header;

import React, { useState } from "react";
import Header from "./component/Header";
import Projects from "./component/Projects";
import AboutMe from "./component/AboutMe";
import Experiences from "./component/Experiences";
import Background3D from "./component/Background3D";
import { motion } from "framer-motion";
import Footer from "./component/Footer";

const App = () => {
  const [section, setSection] = useState(null); // Start with no section selected
  const [headerPosition, setHeaderPosition] = useState("bottom"); // Header position state
  const [showContent, setShowContent] = useState(false); // State to trigger content animation

  const handleSectionClick = (newSection) => {
    setHeaderPosition("top");
    setTimeout(() => {
      setSection(newSection); // Set the section after the header has moved
      setShowContent(true); // Trigger content animation
    }, 500); // Match the duration of the header animation
  };

  const handleBackToHome = () => {
    // reset all states
    setShowContent(false);
    setSection(null);
    setHeaderPosition("bottom");
  };

  return (
    <div style={{ position: "relative", overflow: "auto", minheight: "100vh" }}>
      {/* Background 3D */}
      <Background3D showContent={showContent} headerPosition={headerPosition} />
      <div className="app-container">
        {/* Header */}
        <motion.div
          initial={headerPosition === "bottom" ? { y: "70vh" } : { y: 0 }}
          animate={headerPosition === "top" ? { y: 0 } : { y: "70vh" }}
          transition={{ duration: 0.5 }}
          style={{
            position: headerPosition === "top" ? "relative" : "fixed", // Dynamically adjust position // ISSUE HERE for animation
            width: "100%",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "50px 0", // Add padding for more height
            // Tailwind: Use min-width adjustments for font-size and padding
          }}
        >
          <Header
            currentSection={section}
            setSection={handleSectionClick}
            showBackButton={showContent}
            onBackToHome={handleBackToHome} // Back button callback
          />
        </motion.div>
        {/* Landing Section */}
        {headerPosition === "bottom" && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ zIndex: 1 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-lightestSlate">
              Welcome!
            </h1>
            <h1 className="text-4xl md:text-5xl mb-4 text-white">
              My name is{" "}
              <span className="font-semibold text-white">Venus Lee.</span>
            </h1>
            <p className="text-xl mb-8 text-lightSlate">
              – Let’s explore my work and experiences
            </p>
            {/* Show section button
            <button
              onClick={() => handleSectionClick("Projects")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-xl"
            >
              Explore My Work
            </button> */}
          </div>
        )}

        {/* Main Content */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            padding: "20px",
            marginTop: headerPosition === "top" ? "0px" : "100vh", // Push content down based on header position
            display: section ? "block" : "none", // Hide content if no section is selected
          }}
        >
          {showContent && ( // Only animate content if `showContent` is true
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {section === "Projects" && <Projects />}
              {section === "Experiences" && <Experiences />}
              {section === "AboutMe" && <AboutMe />}
            </motion.div>
          )}
        </main>
        {/* Footer */}
        {showContent && <Footer />}
      </div>
    </div>
  );
};

export default App;

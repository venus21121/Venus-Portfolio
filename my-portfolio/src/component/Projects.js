import React, { useState } from "react";
import favMovieGif from "../assets/gifs/FavoriteMovie.gif";
import strandedGif from "../assets/gifs/stranded.gif";
import munchMateGif from "../assets/gifs/munchMate.gif";
import amaSave from "../assets/amaSave.png";
import Modal from "./Modal";
const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: "AmaSave - Price Tracking Site",
      overview:
        "A web application that tracks Amazon product prices and notifies users when the prices drop to their desired level.",
      accomplishments: [
        "Designed and developed the end-to-end platform, incorporating a secure backend with Spring Boot and a dynamic React-based frontend.",
        "Implemented user registration, authentication (JWT), and session management for secure access.",
        "Built a dynamic product tracking dashboard that displays real-time product prices, historical trends, and status updates.",
        "Integrated web scraping and periodic API updates to fetch real-time product pricing.",
        "Built an automated notification system using Twilio API to deliver real-time price alerts.",
      ],
      languages: ["React", "Spring Boot", "Python", "PostgreSQL "],
      gif: amaSave,
    },
    {
      title: "Favorite Movies Website",
      overview:
        "A personalized movie collection platform that allows users to manage their favorite movies and get tailored recommendations.",
      accomplishments: [
        "As a movie enthusiast, I have built a platform where users can search for movies, add them to personalized lists, and manage reviews using TMDb API.",
        "Developed features for users to store, edit, and delete reviews seamlessly.",
        "Implemented a recommendation engine that suggests movies based on user preferences and TMDb ratings.",
        "Designed a dynamic movie list display that adapts to user rankings for an engaging experience.",
        "Result: The website simplifies movie discovery and has helped users build custom movie libraries with tailored suggestions.",
      ],
      languages: ["Python", "SQLite", "HTML", "CSS"],
      gif: favMovieGif,
    },
    {
      title: "Stranded - 2D Space Survival Game",
      overview:
        "A 2D survival game featuring space exploration, dynamic enemies, and a rich storyline.",
      accomplishments: [
        "Developed as part of a team of 6, contributed to the implementation of core gameplay mechanics and graphics rendering.",
        "Designed the A pathfinding algorithm* for dynamic enemy navigation and mob behaviors.",
        "Developed a fog-of-war system to add challenge and depth to exploration.",
        "Built sprite sheet rendering for smooth character animations.",
        "Optimized memory management and rendering techniques to ensure stable game performance.",
      ],
      languages: ["C++", "OpenGL"],

      gif: strandedGif,
    },
    {
      title: "MunchMate - Mobile Food Search App",
      overview:
        "A mobile app that helps users discover dining options based on location and preferences. ",
      accomplishments: [
        "Developed during a hackathon as part of a team of three, I contributed to building the backend API, integrating Google Places API, and designing a responsive frontend.",
        "Developed a dynamic preference questionnaire to tailor recommendations based on user input.",
        "Integrated location-based search for nearby dining options with clickable results for easy navigation.",
        "Built a sleek, responsive UI using React and Tailwind CSS for smooth user experience.",
      ],
      languages: ["Node.js", "Express.js", "React", "Tailwind CSS"],
      gif: munchMateGif,
    },
    {
      title: "Task Organizer",
      overview:
        "A simple and efficient task organizer to help users manage tasks effectively.",
      accomplishments: [
        "Developed the backend architecture for task management, including task creation, completion, and clearing features.",
        "Designed an intuitive frontend interface using Java AWT and Swing, enabling seamless task organization.",
        "Built components like an app frame and button panels to ensure a responsive user interface.",
      ],
      languages: ["Java (Swing & AWT)"],

      gif: "https://media.giphy.com/media/xT0xeJpnv7JrXvQOTi/giphy.gif",
    },
  ];

  const handleDetailClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="section">
      <section id="projects" className="section-container">
        {projects.map((project, index) => (
          <div
            className="box bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-between"
            key={index}
          >
            <h2 className="title text-xl font-bold text-gray-900">
              {project.title}
            </h2>
            <p className="overview text-gray-600 mt-2">{project.overview}</p>

            {/* Group Languages Section with Button */}
            <div className="languages-and-button mt-4 flex flex-col justify-between">
              {/* Languages Section */}
              {project.languages.length > 0 && (
                <div className="languages mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.languages.map((language, index) => (
                      <div
                        key={index}
                        className="language text-slate px-3 py-1 text-xs"
                      >
                        {language}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Button */}
              <div className="flex justify-center">
                <button
                  className="detail-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                  onClick={() => handleDetailClick(project)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Show the modal when isModalOpen is true */}
      {isModalOpen && (
        <Modal
          data={selectedProject}
          type="project"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Projects;

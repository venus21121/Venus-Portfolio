import React, { useState } from "react";
import schoolIsEasyLogo from "../assets/schoolIsEasy.jpg";
import retinalImage from "../assets/gifs/retinal.gif";
import acerLogo from "../assets/acerLogo.png";
import Modal from "./Modal";

function Experiences() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const experiences = [
    {
      title: "Acer",
      logo: acerLogo,
      overview: "Machine Learning Engineer Intern",
      role: "As a Machine Learning Engineer Intern at Acer, I focused on developing and optimizing a deep learning model for glaucoma classification using retinal images from different stages and demographics. This project aimed to create an automated tool for more accurate early detection of glaucoma.",
      challenges: [
        {
          challenge:
            "The initial model performance was suboptimal, with a sensitivity and specificity of 86%",
          solution:
            "I fine-tuned the learning rates and applied the Bengraham method to enhance the model’s ability to identify glaucoma. This optimization resulted in a 3% improvement in performance.",
        },
      ],
      accomplishments: [
        "Achieved a final sensitivity and specificity of 89% after optimization, leading to better accuracy in detecting glaucoma across diverse datasets.",
        "Implemented model checkpointing, which saved the best-performing weights during training, ensuring optimal results.",
        "Collaborated on data preprocessing techniques, leveraging research findings to improve the quality of input data.",
        "Deployed the model in a testing environment at Acer, and it is now in trial production with B2B clients.",
      ],
      date: "Apr. 2023 – Aug. 2023",
      gif: retinalImage,
    },
    {
      title: "School is Easy",
      logo: schoolIsEasyLogo,
      overview: "Private Tutor",
      role: "As a private tutor, I’ve conducted one-on-one tutoring sessions for elementary and high school students, focusing on strengthening their understanding of various subjects, particularly mathematics.",
      challenges: [
        {
          challenge:
            "A student struggled with understanding complex Calculus concepts, reflected in their low midterm grade.",
          solution:
            "I tailored the lessons to focus on fundamental concepts, provided extra tutoring sessions beyond the regular schedule, and designed customized homework to reinforce the material.",
        },
      ],
      accomplishments: [
        "Improved student’s grade from 45% at midterm to 57% at the final, demonstrating notable progress through focused tutoring.",
        "Designed personalized supplementary assignments, helping students gain a stronger grasp of core concepts.",
      ],
      date: "Jan. 2021 – Present",
    },
  ];

  const handleDetailClick = (experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="section">
      <section id="experiences" className="section-container">
        {experiences.map((experience, index) => (
          <div className="box" key={index}>
            <img
              src={experience.logo}
              alt="company_logo"
              className="mb-4 w-30 h-24 object-contain mx-auto rounded-lg"
            />
            <div className="flex justify-between items-center">
              <h2 className="title">{experience.title}</h2>
              <p className="overview">{experience.date}</p>
            </div>
            <p className="overview">{experience.overview}</p>
            <button
              className="detail-button"
              onClick={() => handleDetailClick(experience)}
            >
              View Details
            </button>
          </div>
        ))}
      </section>
      {/* Show the modal when isModalOpen is true */}
      {isModalOpen && (
        <Modal
          data={selectedExperience}
          type="experience"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Experiences;

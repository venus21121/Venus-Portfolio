import React, { useEffect } from "react";

// Modal Component
const Modal = ({ data, type, onClose }) => {
  // Close modal if clicked outside the modal content
  const modalRef = React.useRef();

  useEffect(() => {
    // Add the 'overflow-hidden' class to body when modal is open
    document.body.classList.add("overflow-hidden");
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal if click happens outside of it
      }
    };

    // Attach the click event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("overflow-hidden");
    };
  }, [onClose]);

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="modal-container bg-navy p-6 rounded-lg max-h-[80vh] overflow-y-auto w-[95%] sm:w-[75%] lg:w-[50%] max-w-[800px]"
      >
        <h2 className="text-2xl  mb-2 text-lightestSlate font-bold">
          Accomplishments:
        </h2>
        {/* Overview or Role Section */}
        {type === "experience" && data.role && (
          <div className="mt-4">
            <h3 className="font-semibold text-lightestSlate">Role/Overview</h3>
            <p className="text-lightSlate">{data.role}</p>
          </div>
        )}
        {/* Challenges & Solutions (for experiences) */}
        {type === "experience" &&
          data.challenges &&
          data.challenges.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-lightestSlate">
                Challenges & Solutions
              </h3>
              <ul className="list-inside">
                {data.challenges.map((item, index) => (
                  <li key={index} className="mb-2 text-lightSlate">
                    - {item.challenge}
                    <br />- {item.solution}
                  </li>
                ))}
              </ul>
            </div>
          )}
        <ul className="space-y-2">
          {data.accomplishments.map((item, index) => (
            <li key={index} className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {/* bullseye Icon Path */}
                {/* <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-14a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" /> */}
                {/* check Icon Path */}
                <path d="M20.285 6.721l-11.405 11.718-4.84-4.961 1.39-1.391 3.45 3.531 10.016-10.289z" />
              </svg>
              <span className="text-lightSlate">{item}</span>
            </li>
          ))}
        </ul>
        {/* Example of Adding GIF */}
        <div className="mt-4">
          {data.gif && (
            <img
              src={data.gif}
              alt="Example GIF"
              className="w-full h-[300px] object-contain border-1 border-green rounded-lg transition-all duration-300 transform filter grayscale hover:grayscale-0 hover:filter-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Modal;

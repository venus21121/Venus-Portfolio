module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Make sure this path includes all your components
  theme: {
    extend: {
      colors: {
        navy: "#0a192f",
        lightNavy: "#112240",
        lightestNavy: "#233554",
        slate: "#8892b0",
        lightSlate: "#a8b2d1",
        lightestSlate: "#ccd6f6",
        white: "#e6f1ff",
        green: "#64ffda",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};

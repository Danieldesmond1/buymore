import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#0d0d0d"
    }}>
      <DotLottieReact
        src="https://lottie.host/179b4d4d-8816-4349-ac96-a6eaec2f54e1/TgJhlhKfUl.lottie"
        autoplay
        loop
      />
    </div>
  );
};

export default Loader;

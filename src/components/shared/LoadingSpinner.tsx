"use client";
import { ScaleLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="sweet-loading flex justify-center items-center min-h-screen">
      <ScaleLoader color="#f472b6" loading={true} />
    </div>
  );
};

export default LoadingSpinner;

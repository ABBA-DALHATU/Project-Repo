import React from "react";
import { Spinner } from "./Spinner";

const FullPageLoader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default FullPageLoader;

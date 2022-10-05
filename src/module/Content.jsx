import React from "react";
import PathRoutes from "../routes";

const Content = () => {
  console.log("content render");
  return (
    <section className="main-content">
      <PathRoutes />
    </section>
  );
};

export default Content;

import React from "react";
import PathRoutes from "../routes";
import { useLocation } from "react-router-dom";

const Content = () => {
  const location = useLocation();
  console.log("content render %o", location);
  return (
    <section className="main-content">
      <PathRoutes />
    </section>
  );
};

export default Content;

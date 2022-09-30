import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Test = () => {
  const navi = useNavigate();
  const location = useLocation();

  return (
    <div onClick={() => navi(-1)} style={{ cursor: "pointer" }}>
      테스트입니다.
    </div>
  );
};

export default Test;

import React from "react";
import { useNavigate } from "react-router-dom";

const Test2 = () => {
  const navi = useNavigate();
  return (
    <div onClick={() => navi(-1)} style={{ cursor: "pointer" }}>
      테스트입니다.222222
    </div>
  );
};

export default Test2;

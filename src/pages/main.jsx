import React from "react";
import { useNavigate } from "react-router-dom";

const main = () => {
  const navi = useNavigate();

  const onClick = (event) => {
    event.preventDefault();
    navi(event.target.dataset["path"], { state: { val: 1 } });
  };
  return (
    <div
      className={"center-wapper"}
      style={{
        fontWeight: 800,
        fontSize: "25px",
        letterSpacing: "5px",
      }}
    >
      메인입니다.
      <br />
      JWT 인증관련 TEST 중 입니다.
    </div>
  );
};

export default main;

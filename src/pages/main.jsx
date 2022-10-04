import React from "react";
import { useNavigate } from "react-router-dom";

const main = () => {
  const navi = useNavigate();

  const onClick = (event) => {
    event.preventDefault();
    navi(event.target.dataset["path"], { state: { val: 1 } });
  };
  return <div>메인입니다.</div>;
};

export default main;

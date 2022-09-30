import React from "react";
import { useNavigate } from "react-router-dom";
const main = () => {
  const navi = useNavigate();

  const onClick = (event) => {
    event.preventDefault();
    navi(event.target.dataset["path"], { state: { val: 1 } });
  };
  return (
    <div>
      메인입니다.
      <br />
      <a onClick={onClick} data-path="/dept1/test" href="">
        테스트1로 이동
      </a>
      <br />
      <a onClick={onClick} data-path="/dept1/test2" href="">
        테스트2로 이동
      </a>
      <br />
    </div>
  );
};

export default main;

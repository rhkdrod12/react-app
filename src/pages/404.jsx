import React from "react";
import { StyleDiv } from "../module/StyleComp/StyleComp";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useStableNavigate } from "../module/BasicComp/StableNavigateContext.jsx";
import { FadeDiv } from "../module/BasicComp/Fade.jsx";

const NotFound = () => {
  // let locationStateLocation = useLocation();
  const navigate = useStableNavigate();

  // console.log(locationStateLocation);
  return (
    <StyleDiv
      inStyle={{
        position: "relative",
        display: "grid",
        justifyContent: "center ",
        height: "100%",
        alignContent: "center",
        justifyItems: "center",
      }}
    >
      <img src="/png/404-error.png" />

      <StyleDiv
        inStyle={{ margin: 30, display: "inline-block", fontSize: "40px" }}
      >
        Not Found Page
      </StyleDiv>
      <StyleDiv
        inStyle={{
          color: "#d14545",
          margin: 0,
          display: "inline-block",
          fontSize: "40px",
        }}
      >
        {`${origin}${location.pathname}`}
      </StyleDiv>

      <Button
        variant="text"
        sx={{ fontSize: "20px" }}
        onClick={() => navigate(-1)}
      >
        뒤로 돌아가기
      </Button>
      <Button
        variant="text"
        sx={{ fontSize: "20px" }}
        onClick={() => navigate("/")}
      >
        메인으로 이동
      </Button>
      <FadeDiv
        animate={{
          opacity: 1,
          transition: { property: "opacity", duration: 5 },
        }}
      >
        테스트 나타나는지
      </FadeDiv>
      <a
        href="https://www.flaticon.com/free-icons/404-error"
        title="404 error icons"
        style={{
          position: "absolute",
          display: "inline-block",
          bottom: "1px",
          color: "rgb(158, 166, 173)",
          fontSize: "5px",
        }}
      >
        404 error icons created by itim2101 - Flaticon
      </a>
    </StyleDiv>
  );
};

export default NotFound;

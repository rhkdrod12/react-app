import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const Loading = ({ scale = 1, message = "", error }) => {
  return (
    <div className="loading-wapper" style={{ transform: `scale(${scale})` }}>
      <img src="/gif/loading.gif" />
      <div style={{ textAlign: "center", height: "fit-content" }}>
        <span
          style={{
            wordSpacing: "3px",
            fontWeight: 700,
          }}
        >
          L o a d i n g . . .
        </span>
      </div>
      {/*<div>{message}</div>*/}
      <Button variant="text" sx={{ fontSize: "20px", marginTop: "15px" }}>
        {error && (
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            메인으로 이동
          </Link>
        )}
      </Button>
    </div>
  );
};

export default Loading;

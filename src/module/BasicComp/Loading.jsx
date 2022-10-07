import React from "react";

const Loading = ({ scale = 1, message = "" }) => {
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
      <div>{message}</div>
    </div>
  );
};

export default Loading;

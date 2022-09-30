import { MenuList } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { StyleDiv, StyleHeader } from "./StyleComp/StyleComp.jsx";
import HeaderMenu from "./ModuleComp/HeaderMenu.jsx";
import { useNavigate } from "react-router-dom";

const Header = ({ height = 50 }) => {
  const navi = useNavigate();
  return (
    <HeaderWrap inStyle={{ height }} classNamme="main-header">
      {/* 왼쪽 항목*/}
      <StyleDiv
        inStyle={{
          padding: "0px 10px 0px 10px",
          width: 200,
          textAlign: "left",
          display: "flex",
        }}
      >
        <HeaderTitle inStyle={{ cursor: "pointer" }} onClick={() => navi("/")}>
          TESTING
        </HeaderTitle>
      </StyleDiv>
      {/* 메뉴항목 */}
      <HeaderMenu />
      {/* <Menu height={height}></Menu> */}
      {/* 오른쪽 항목 */}
      <StyleDiv
        inStyle={{
          padding: "0px 10px 0px 10px",
          width: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <LoginBtn /> */}
      </StyleDiv>
    </HeaderWrap>
  );
};

const HeaderWrap = styled(StyleHeader)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(185, 185, 185);
`;

const HeaderTitle = styled(StyleDiv)`
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #101010;
  text-shadow: 1px 1px 1px rgb(124, 121, 121);
`;

export default Header;

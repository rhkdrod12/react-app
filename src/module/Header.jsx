import { Button, MenuList } from "@mui/material";
import React, { Fragment } from "react";
import styled from "styled-components";
import { StyleDiv, StyleHeader } from "./StyleComp/StyleComp.jsx";
import HeaderMenu from "./ModuleComp/HeaderMenu.jsx";
import { useNavigate } from "react-router-dom";
import COM from "../utils/System.js";
import axios from "axios";
import { Authorization } from "../utils/authorization.jsx";

const Header = ({ height = 50 }) => {
  const navi = useNavigate();

  const accessToken = sessionStorage.getItem(COM.ACCESS_TOKEN);

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
      <Button
        variant="contained"
        color="secondary"
        sx={{ width: 150 }}
        onClick={() => navi("/fileMgm/fileUpload")}
      >
        업로드
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ width: 150 }}
        onClick={() => navi("/fileMgm/fileDownLoad")}
      >
        다운로드
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ width: 150 }}
        onClick={() => navi("/")}
      >
        메인
      </Button>

      <StyleDiv
        inStyle={{
          padding: "0px 10px 0px 10px",
          width: 150,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {accessToken ? <LogoutBtn /> : <LoginBtn />}
      </StyleDiv>
    </HeaderWrap>
  );
};

/**
 * 로그인 버튼
 * @returns {JSX.Element}
 * @constructor
 */
const LoginBtn = () => {
  const navi = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navi("/user/login")}
    >
      로그인
    </Button>
  );
};

/**
 * 로그아웃 버튼
 * @returns {JSX.Element}
 * @constructor
 */
const LogoutBtn = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    // 인증토큰 삭제
    Authorization.deleteToken();
    // 홈으로 이동
    navigate("/");
  };
  return (
    <Button variant="contained" color="secondary" onClick={onLogout}>
      로그아웃
    </Button>
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

import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formFetch } from "../../hook/useFetch.jsx";
import { Button, createTheme, TextField, ThemeProvider } from "@mui/material";
import styled from "styled-components";
import { Authorization } from "../../utils/authorization.jsx";

/**
 * 로그인 관련 컴포넌트
 * @returns {JSX.Element}
 * @constructor
 */
const Login = () => {
  const [formValue, setFormValue] = useState({ username: "", passward: "" });
  const navi = useNavigate();
  const movePath = useLocation()?.state?.prePath || "/";

  console.log("state: %o", movePath);

  const onLogin = useCallback(
    (event) => {
      setFormValue((value) => {
        formFetch("/login", value)
          .then((res) => {
            // 인증 셋!
            Authorization.setToken(res);

            // 메인으로 이동
            console.log("메인으로 이동 %o", movePath);
            navi(movePath);
          })
          .catch((reason) => {
            console.log("로그인 실패 ");
          });

        return value;
      });
    },
    [movePath]
  );
  const onChange = ({ target }) => {
    setFormValue((item) => ({ ...item, [target.name]: target.value }));
  };
  const onJoin = () => {};
  return (
    <LoginContainer>
      <LoginTitle>USER LOGIN</LoginTitle>
      <form>
        <LoginInputArea>
          <ThemeProvider theme={theme}>
            <TextField
              id="id"
              label="ID"
              type="text"
              color="primary"
              value={formValue.id}
              name="username"
              autoComplete="on"
              onChange={onChange}
            />
            <TextField
              id="pwd"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formValue.passward}
              name="passward"
              // autocomplte="on"
              onChange={onChange}
            />
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={onLogin}
            >
              로그인
            </Button>
            <Button variant="contained" color="secondary" onClick={onJoin}>
              회원가입
            </Button>
          </ThemeProvider>
        </LoginInputArea>
      </form>
    </LoginContainer>
  );
};
const theme = createTheme({
  palette: {
    primary: {
      main: "#607d8b",
      contrastText: "#fff",
    },
  },
});

theme.palette.primary;

/**
 * 로그인 화면 제목
 * @type {StyledComponent<"div", AnyIfEmpty<DefaultTheme>, {}, never>}
 */
const LoginTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 8px;
  color: #7c7576;
  //text-shadow: 1px 1px 0px #645f5f;
  margin-bottom: 25px;
  text-align: center;
`;

/**
 * Inputbox와 버튼 컨테이너
 * @type {StyledComponent<"div", AnyIfEmpty<DefaultTheme>, {}, never>}
 */
const LoginInputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/**
 * 로그인 컨테이너
 * @type {StyledComponent<"div", AnyIfEmpty<DefaultTheme>, {}, never>}
 */
const LoginContainer = styled.div`
  display: grid;
  width: 400px;
  height: 400px;
  background: #eceff1;
  margin: 0 auto;
  align-content: center;
  justify-content: center;
  box-shadow: 0px 0px 3px 1px #8d9a9a;
  transform: translateY(50%);
`;

export default Login;

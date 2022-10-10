import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultFormFetch, formFetch } from "../../hook/useFetch.jsx";
import { Button, createTheme, TextField, ThemeProvider } from "@mui/material";
import styled from "styled-components";
import { LoadingButton } from "@mui/lab";
import { enterEvent } from "../../utils/defaultKepEvent.jsx";
import { Authorization } from "../../utils/authorization.jsx";
import { useReset } from "../../hook/useReset.jsx";
import useMessageModal from "../../hook/useMessageModal.jsx";

const initFormValue = { username: "", passward: "" };
/**
 * 로그인 관련 컴포넌트
 * @returns {JSX.Element}
 * @constructor
 */
const Login = () => {
  const [formValue, setFormValue] = useState({ ...initFormValue });
  const [loading, setLoading] = useState(false);

  const navi = useNavigate();
  const movePath = useLocation()?.state?.prePath || "/";
  const modalMessage = useMessageModal();
  const btnRef = useRef();
  const formRef = useRef();

  // 초기화
  useReset(() => {
    setFormValue({ ...initFormValue });
    setLoading(false);
  });

  console.log("state: %o", movePath);

  const onLogin = useCallback(
    (event) => {
      event.preventDefault();
      setLoading(true);
      setFormValue((value) => {
        defaultFormFetch("/login", value)
          .then((res) => {
            // 인증 셋!
            Authorization.setToken(res);

            // 메인으로 이동
            console.log("메인으로 이동 %o", movePath);
            setLoading(false);
            navi(movePath);
          })
          .catch((reason) => {
            setLoading(false);
            console.log("로그인 실패 ");
            modalMessage(reason.resultMessage);
          });

        return value;
      });
    },
    [movePath]
  );

  const onChange = ({ target }) => {
    setFormValue((item) => ({ ...item, [target.name]: target.value }));
  };
  const onJoin = () => {
    navi("/user/join");
  };

  return (
    <LoginContainer>
      <LoginTitle>USER LOGIN</LoginTitle>
      <form onSubmit={onLogin} ref={formRef}>
        <LoginInputArea>
          <ThemeProvider theme={theme}>
            <TextField
              id="id"
              label="ID"
              type="text"
              color="primary"
              value={formValue.username}
              name="username"
              autoComplete="username"
              onChange={onChange}
              inputProps={{ pattern: "[a-zA-Z0-9]+" }}
              disabled={loading}
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
              onKeyUp={enterEvent(() => {
                btnRef.current.click();
              })}
              disabled={loading}
            />
            <LoadingButton
              id="loginBtn"
              loading={loading}
              variant="contained"
              color="primary"
              type="submit"
              ref={btnRef}
            >
              로그인
            </LoadingButton>
            <Button
              variant="contained"
              color="secondary"
              onClick={onJoin}
              disabled={loading}
            >
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

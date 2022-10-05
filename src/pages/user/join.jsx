import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formFetch } from "../../hook/useFetch.jsx";
import {
  createTheme,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  ThemeProvider,
  unstable_useId,
} from "@mui/material";
import styled from "styled-components";
import COM from "../../utils/System.js";
import { LoadingButton } from "@mui/lab";
import { enterEvent } from "../../utils/defaultKepEvent.jsx";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * 로그인 관련 컴포넌트
 * @returns {JSX.Element}
 * @constructor
 */
const Join = () => {
  console.log("Join 화면 render");
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const navi = useNavigate();

  const movePath = useLocation()?.state?.prePath || "/";
  const btnRef = useRef();
  const formRef = useRef();

  const onJoin = useCallback(
    (event) => {
      event.preventDefault();
      setLoading(true);
    },
    [movePath]
  );

  const onChange = ({ target }) => {
    setFormValue((item) => ({ ...item, [target.name]: target.value }));
  };

  const onKeyup = () => enterEvent(() => btnRef.current.click());

  useEffect(() => {
    return () => setLoading(false);
  });

  return (
    <JoinContainer>
      <JoinTitle>USER JOIN</JoinTitle>
      <form onSubmit={onJoin} ref={formRef}>
        <LoginInputArea>
          <ThemeProvider theme={theme}>
            {/*<CustomInput label={"아이디"} value={formValue.id} name="userName" onChange={onChange} shrink />*/}
            <TextField
              id="username"
              label="ID"
              type="text"
              autoComplete="username"
              value={formValue.username}
              name="username"
              variant="standard"
              InputLabelProps={{ shrink: true }}
              onChange={onChange}
              onKeyUp={enterEvent(() => btnRef.current.click())}
              disabled={loading}
            />
            <PasswordInput
              id={"pwd"}
              disabled={loading}
              name={"password"}
              value={formValue.password}
              event={{
                onChange,
              }}
            />
            <TextField
              id="name"
              label="Name"
              type="text"
              autoComplete="name"
              value={formValue.name}
              name="name"
              variant="standard"
              InputLabelProps={{ shrink: true }}
              onChange={onChange}
              disabled={loading}
            />
            <TextField
              id="email"
              label="Email"
              type="text"
              autoComplete="email"
              value={formValue.email}
              name="email"
              variant="standard"
              InputLabelProps={{ shrink: true }}
              onChange={onChange}
              onKeyUp={onKeyup}
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
              JOIN
            </LoadingButton>
          </ThemeProvider>
        </LoginInputArea>
      </form>
    </JoinContainer>
  );
};

const JoinInput = (
  id,
  label,
  name,
  type,
  autoComplete,
  value,
  disabled,
  validFunc,
  pattern,
  validMessage,
  ...params
) => {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      autoComplete={autoComplete}
      value={value}
      name={name}
      variant="standard"
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      // onChange={onChange}
      // onKeyUp={enterEvent(() => btnRef.current.click())}
      {...params}
    />
  );
};

const PasswordInput = ({ id, name, value, disabled, event, ...params }) => {
  const [show, setShow] = useState(false);
  return (
    <TextField
      id={id}
      label="Password"
      type={show ? "text" : "password"}
      autoComplete="current-password"
      value={value}
      name={name}
      variant="standard"
      InputLabelProps={{ shrink: true }}
      disabled={disabled}
      {...event}
      {...params}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShow((value) => !value)}
              edge="end"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const CustomInput = ({
  label,
  name,
  value,
  onChange,
  validMessage,
  shrink,
  error,
}) => {
  return (
    <FormControl variant="standard" error={error}>
      <InputLabel shrink={shrink}>{label}</InputLabel>
      <Input name={name} value={value} onChange={onChange} />
      {validMessage ? <FormHelperText>{validMessage}</FormHelperText> : null}
    </FormControl>
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
const JoinTitle = styled.div`
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
const JoinContainer = styled.div`
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

export default Join;

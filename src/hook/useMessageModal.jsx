import React, {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { Fade } from "../module/BasicComp/Fade.jsx";
import { StyleDiv } from "../module/StyleComp/StyleComp";

/**
 * 모달 타입
 * @readonly
 * @enum {string}
 * @property {String} CONFIRM 확인 모달창인 경우
 * @property {String} ALERT   알림 모달창인 경우
 * @property {String} ERROR   에러 모달창인 경우
 */
export const MODAL_TYPE = {
  CONFIRM: "확 인", // 확인
  ALERT: "알 림", //  경고
  ERROR: "에 러", // 에러
};

export const ModalsStateContext = createContext(null);
export const ModalsDispatchContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [param, setParam] = useState({});
  return (
    <ModalsStateContext.Provider value={param}>
      <ModalsDispatchContext.Provider value={setParam}>
        {children}
      </ModalsDispatchContext.Provider>
    </ModalsStateContext.Provider>
  );
};

/**
 * 모달을 설정객체
 * @typedef {Object} modalConfig
 * @property {String} [type] MODAL_TYPE(CONFIRM, ALERT, ERROR)
 * @property {Function} [onSubmit] - 확인 클릭시 동작할 콜백함수
 * @property {Function} [onClose] - 닫기 클릭시 동작할 콜백함수
 */
/**
 * 모달을 입력한 메시지로 호출하는 함수
 * @callback modalFunction
 * @param {String} message 모달에 출력할 메시지
 * @param {modalConfig} [config] 모달 설정 객체
 */
/**
 * MessageModal창을 활성화 시키는 함수를 반환하는 hook
 * @function useMessageModal
 * @param {modalConfig} [defaultConfig] 모달 설정
 * @returns {modalFunction}
 */
const useMessageModal = (defaultConfig) => {
  /** @type {function} */
  const setParam = useContext(ModalsDispatchContext);
  return useCallback(
    (message, config) =>
      setParam({ isOpen: true, message, config: config || defaultConfig }),
    [defaultConfig]
  );
};

/**
 * 모달 컴포넌트
 * 최상위쪽에 선언되어있어 전역에서 사용할 수 있도록 하였음
 * useMessageModal을 통해 선언하고 반환된 함수를 사용하여 모달을 호출
 * @returns {JSX.Element}
 * @constructor
 */
export const ModalComponent = () => {
  const { isOpen = false, message, config } = useContext(ModalsStateContext);
  /** @type {function} */
  const setParam = useContext(ModalsDispatchContext);
  const { onSubmit, onClose, type = MODAL_TYPE.ALERT } = config || {};

  const onDefaultSubmit = () => {
    setParam((param) => {
      if (onSubmit) onSubmit();
      return { ...param, isOpen: false };
    });
  };
  const onDefaultClose = () => {
    setParam((param) => {
      if (onClose) onClose();
      return { ...param, isOpen: false };
    });
  };

  const upperRef = useRef();

  return (
    <Fragment>
      {isOpen ? (
        <ModalOverlay ref={upperRef}>
          <ThemeProvider theme={theme}>
            <ModalContainer
              className={"modal-message-container"}
              upperRef={upperRef}
            >
              <ModalWarp>
                <ModalTitle>
                  {type}
                  <CloseIcon
                    onClick={onDefaultClose}
                    sx={{
                      "&:hover": {
                        color: "rgba(0,0,0,0.6)",
                      },
                    }}
                  ></CloseIcon>
                </ModalTitle>
                <ModalContent>{message}</ModalContent>
                <ModalBottom>
                  {type == MODAL_TYPE.CONFIRM ? (
                    <Fragment>
                      <LoadingButton
                        id="loginBtn"
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="small"
                        sx={{ height: 35 }}
                        onClick={onDefaultSubmit}
                      >
                        확인
                      </LoadingButton>
                      <Button
                        variant="contained"
                        color="cancel"
                        size="small"
                        sx={{ height: 35 }}
                        onClose={onDefaultClose}
                      >
                        취소
                      </Button>
                    </Fragment>
                  ) : (
                    <LoadingButton
                      id="loginBtn"
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="small"
                      sx={{ height: 35 }}
                      onClick={onDefaultSubmit}
                      onClose={onDefaultClose}
                    >
                      확인
                    </LoadingButton>
                  )}
                </ModalBottom>
              </ModalWarp>
            </ModalContainer>
          </ThemeProvider>
        </ModalOverlay>
      ) : null}
    </Fragment>
  );
};

const MoveContainer = ({ children, className, upperRef }) => {
  const [move, setMove] = useState(false);
  const [offset, setOffset] = useState({ moveX: 0, moveY: 0 });
  const [rect, setRect] = useState({ left: 0, top: 0 });
  const curRef = useRef();

  // 초기값 지정
  useEffect(() => {
    const upperRect = upperRef?.current.getBoundingClientRect();
    setRect((val) => ({
      left: upperRect.width / 2,
      top: upperRect.height / 2,
    }));
    return () => {
      setMove(false);
      setOffset({ moveX: 0, moveY: 0 });
      setRect({ left: 0, top: 0 });
    };
  }, []);

  // 마우스 누르기 이벤트
  const onMouseDown = (event) => {
    setMove(true);
  };

  // 마우스 이동 이벤트
  const onMouseMove = (event) => {
    if (move) {
      setOffset((val) => {
        const result = {
          moveX: val.moveX + event.movementX,
          moveY: val.moveY + event.movementY,
        };
        return result;
      });
    }
  };

  // 마우스 떼기 이벤트
  const onMouseUp = (event) => {
    setMove(false);
  };

  return (
    <StyleDiv
      ref={curRef}
      className={className}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        left: `${
          ((rect.left / 2 + offset.moveX / 2) / rect.left) * 100 || 50
        }%`,
        top: `${((rect.top / 2 + offset.moveY / 2) / rect.top) * 100 || 50}%`,
      }}
    >
      {upperRef && children}
    </StyleDiv>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#607d8b",
      contrastText: "#fff",
    },
    cancel: {
      main: "#ffffff",
      contrastText: "#607d8b",
    },
  },
});
const ModalOverlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
  z-index: 99;
`;
const ModalContainer = styled(MoveContainer)`
  position: absolute;
  //top: 50%;
  //left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
  max-width: 600px;
  //min-height: 300px;
  //max-height: 600px;
`;
const ModalWarp = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 40px auto 40px;
  background: #fafafa;
  padding: 15px 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 1px 1px rgb(0 0 0 / 20%), 0px 0px 2px 2px rgb(0 0 0 / 14%),
    0px 0px 5px 3px rgb(0 0 0 / 12%);
`;
const ModalTitle = styled.div`
  display: grid;
  align-content: center;
  text-align: center;
  font-size: 30px;
  font-weight: 800;
  position: relative;
  height: 100%;

  & svg {
    position: absolute;
    right: 0px;
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
`;
const ModalContent = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  min-height: 100px;
`;
const ModalBottom = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-self: center;
  align-self: center;
  grid-gap: 20px;
`;

export default useMessageModal;

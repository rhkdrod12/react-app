import { useEffect, useRef, useState } from "react";
import { StyleDiv } from "../StyleComp/StyleComp";
import "/src/css/global.css";
/**
 * Fade 컴포넌트 자식 컴포넌트를 출력할 떄 fade in, out을 실시함
 * @param {boolean} state on/off
 * @param {Object} style style
 * @param {String} fadeIn fadeIn을 실시할 애니메이션(global.css에 작성)
 * @param {String }fadeOut fadeOut을 실시할 애니메이션(global.css에 작성)
 * @return {JSX.Element|null}
 * @constructor
 */
export const Fade = ({
  children,
  state,
  style = {},
  fadeIn = "fadeIn",
  fadeOut = "fadeOut",
  endEvent,
  className,
}) => {
  const [fade, setFade] = useState(true);
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setShow((val) => {
      if (state) {
        setFade(true);
        return true;
      } else {
        setFade(false);
        return val;
      }
    });
  }, [state]);

  // fadeOut시 동작
  const onAnimationEnd = (event) => {
    if (show && ref.current == event.target && event.animationName == fadeOut) {
      if (endEvent instanceof "function") endEvent();
      setShow(false);
    }
  };

  // 스타일 기본 설정
  return show ? (
    <StyleDiv
      ref={ref}
      inStyle={{
        transformOrigin: "top",
        animation: `${fade ? "2s " + fadeIn : "1s " + fadeOut} forwards`,
        ...style,
      }}
      className={className}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </StyleDiv>
  ) : null;
};

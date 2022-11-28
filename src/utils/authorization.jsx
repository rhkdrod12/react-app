import COM from "./System.js";
import { COM_MESSAGE } from "./commonMessage.js";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosError, axiosInstance, DEFAULT_URL } from "../hook/useFetch.jsx";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Loading from "../module/BasicComp/Loading.jsx";
import axios from "axios";
import useMessageModal from "../hook/useMessageModal.jsx";
import { useStableNavigate } from "../module/BasicComp/StableNavigateContext.jsx";

const test = true;

/**
 * 인증용 라우터
 * 해당 경로로 이동시키기전에 서버에서 액세스 토큰의 값을 검증하여 이동 가능 여부를 확인하는 라우터
 * @param Children
 * @param key
 * @param path
 * @returns {JSX.Element}
 * @constructor
 */
export const AuthRoutes = ({ children: Children, key, path }) => {
  const modalMessage = useMessageModal();
  const navigate = useStableNavigate();
  const [authorization, setAuthorization] = useState(false);
  const [error, setError] = useState(false);

  console.log("인증 라우터 %o", path);

  // 로그인 화면으로 이동 이벤트
  const onMoveLogin = useCallback(() => {
    navigate("/user/login", { state: { prePath: path } });
  }, [path]);

  if (test) {
    return <Fragment>{Children}</Fragment>;
  }

  useEffect(() => {
    axios
      .post(
        `${DEFAULT_URL}/auth/access`,
        { path: path },
        {
          headers: {
            [COM.AUTHORIZATION]: Authorization.getAccessToken(),
          },
          withCredentials: true,
          timeout: COM.TIME_OUT,
        }
      )
      .then((res) => {
        setAuthorization(true);
      })
      .catch((error) => {
        const { resultCode, resultMessage } = axiosError(error);
        setAuthorization(false);
        if (
          COM_MESSAGE.UNAUTHORIZED.resultCode === resultCode ||
          COM_MESSAGE.EXPIRE_AUTHORIZED.resultCode === resultCode
        ) {
          // 권한없는 경우 로그인 알림창 후 로그인 화면으로 이동
          modalMessage(resultMessage, {
            onSubmit: onMoveLogin,
            onClose: onMoveLogin,
          });
        } else {
          // 에러 메시지 출력
          setError(true);
          modalMessage(resultMessage);
        }
      });

    return () => {
      setError(false);
      setAuthorization(false);
    };
  }, [key]);

  return (
    <Fragment>{authorization ? Children : <Loading error={error} />}</Fragment>
  );
};

export class Authorization {
  /**
   * 인증 토큰을 세션스토리지에 저장 및 Header에 지정
   * 갱신 토큰을 로컬스토리지에 저장
   * @param {string} accessToken
   * @param {string} refreshToken
   */
  static setToken({ accessToken, refreshToken }) {
    // 인증 토큰 셋
    sessionStorage.setItem(COM.ACCESS_TOKEN, accessToken);
    // 갱신 토큰 셋
    localStorage.setItem(COM.REFRESH_TOKEN, refreshToken);
    // 헤더에 Authorization 항목으로 accessToken 지정
    axiosInstance.defaults.headers.common[COM.AUTHORIZATION] = accessToken;
  }

  /**
   * 인증 토큰을 세션스토리지에서 제거 및 Header에서 제거
   */
  static deleteToken() {
    // 액세스 토큰 제거
    sessionStorage.removeItem(COM.ACCESS_TOKEN);
    // 리플래쉬 토큰 제거
    localStorage.removeItem(COM.REFRESH_TOKEN);
    // 인증 헤더 제거
    delete axiosInstance.defaults.headers.common[COM.AUTHORIZATION];
  }

  /**
   * 인증 토큰을 헤더와 세션 스토리지에 저장(일단 )
   * @param {string} accessToken
   */
  static setAccessToken(accessToken) {
    // 인증 토큰 셋
    sessionStorage.setItem(COM.ACCESS_TOKEN, accessToken);
    // 헤더에 Authorization 항목으로 accessToken 지정
    axiosInstance.defaults.headers.common[COM.AUTHORIZATION] = accessToken;
  }

  /**
   * 갱신 토큰을 로컬 스토리지에 저장
   * @param {string} refreshToken
   */
  static setRefreshToken(refreshToken) {
    // 갱신 토큰 셋
    localStorage.setItem(COM.REFRESH_TOKEN, refreshToken);
  }

  /**
   * 인증토큰 삭제
   */
  static deleteAccessToken() {
    sessionStorage.removeItem(COM.ACCESS_TOKEN);
    delete axiosInstance.defaults.headers.common[COM.AUTHORIZATION];
  }

  /**
   * 갱신토큰 삭제
   */
  static deleteRefreshToken() {
    localStorage.removeItem(COM.REFRESH_TOKEN);
  }

  static getAccessToken() {
    return sessionStorage.getItem(COM.ACCESS_TOKEN);
  }
}

/**
 * 인증용 컴포넌트(useNavigate를 사용하기 위한 용도)
 * @param children
 * @returns {*}
 * @constructor
 */
export const AxiosInterceptor = ({ children }) => {
  // 현재의 navi로 기본 설정 지정
  axiosRsInterceptor(useNavigate());
  return children;
};

/**
 * axios Interceptor 설정
 * axios에 인증관련 로직 삽입
 * @param navigate
 * @returns {number}
 */
const axiosRsInterceptor = (navigate) => {
  return axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const errorResult = axiosError(error);
      // 미인증 상태
      if (errorResult.resultCode == COM_MESSAGE.UNAUTHORIZED.resultCode) {
        // 로그인 요청 화면 또는 거부 화면처리
        console.log("미인증 상태 %o", location.pathname);
        // 엑세스 토큰 삭제
        sessionStorage.removeItem(COM.ACCESS_TOKEN);
        // 리플래쉬 토큰 삭제
        sessionStorage.removeItem(COM.REFRESH_TOKEN);
        // 로그인 화면으로 이동처리(현재 path정보를 가지고 이동시킴)
        navigate("/user/login", {
          state: { movePath: location.pathname },
          replace: true,
        });
        // promise 제거처리
        return new Promise(() => {});
      }
      // 토큰 만료 상태 - refreshToken으로 재요청
      else if (
        errorResult.resultCode == COM_MESSAGE.EXPIRE_AUTHORIZED.resultCode
      ) {
        // 토큰 갱신 요청, refreshToken이 있는 경우에만
        console.log("토큰 갱신 요청 필요");
        // 엑세스 토큰 삭제 - 갱신은 요청하더라도 일단 액세스 토큰은 삭제처리
        sessionStorage.removeItem(COM.ACCESS_TOKEN);
        // 에러 처리
        return Promise.reject(error);
      }
      // 그냥 에러
      else {
        // 에러 처리
        return Promise.reject(error);
      }
    }
  );
};

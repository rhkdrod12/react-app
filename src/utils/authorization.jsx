import COM from "./System.js";
import { COM_MESSAGE } from "./commonMessage.js";
import { useNavigate } from "react-router-dom";
import { axiosError, axiosInstance } from "../hook/useFetch.jsx";

export class Authorization {
  /**
   * 인증 토큰을 세션스토리지에 저장 및 Header에 지정
   * 갱신 토큰을 로컬스토리지에 저장
   * @param accessToken
   * @param refreshToken
   */
  static setToken({ accessToken, refreshToken }) {
    // 인증 토큰 셋
    sessionStorage.setItem(COM.ACCESS_TOKEN, accessToken);
    // 갱신 토큰 셋
    localStorage.setItem(COM.REFRESH_TOKEN, refreshToken);
    // 헤더에 Authorization 항목으로 accessToken 지정
    axiosInstance.defaults.headers.common["Authorization"] = accessToken;
  }

  /**
   * 인증 토큰을 세션스토리지에서 제거 및 Header에서 제거
   */
  static deleteToken() {
    sessionStorage.removeItem(COM.ACCESS_TOKEN);
    localStorage.removeItem(COM.REFRESH_TOKEN);
    delete axiosInstance.defaults.headers.common["Authorization"];
  }

  /**
   * 인증 토큰을 헤더와 세션 스토리지에 저장(일단 )
   * @param accessToken
   */
  static setAccessToken(accessToken) {
    // 인증 토큰 셋
    sessionStorage.setItem(COM.ACCESS_TOKEN, accessToken);
    // 헤더에 Authorization 항목으로 accessToken 지정
    axiosInstance.defaults.headers.common["Authorization"] = accessToken;
  }

  /**
   * 갱신 토큰을 로컬 스토리지에 저장
   * @param refreshToken
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
    delete axiosInstance.defaults.headers.common["Authorization"];
  }

  /**
   * 갱신토큰 삭제
   */
  static deleteRefreshToken() {
    localStorage.removeItem(COM.REFRESH_TOKEN);
  }
}

/**
 * 인증용 컴포넌트(useNavigate를 사용하기 위한 용도)
 * @param children
 * @returns {*}
 * @constructor
 */
export const AxiosInterceptor = ({ children }) => {
  console.log("interceptor 동작1");
  const navi = useNavigate();
  // 기본 설정 지정
  const inter = axiosRsInterceptor(navi);
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
        console.log("미인증 상태");
        // 엑세스 토큰 삭제
        sessionStorage.removeItem(COM.ACCESS_TOKEN);
        // 리플래쉬 토큰 삭제
        sessionStorage.removeItem(COM.REFRESH_TOKEN);

        navigate("/user/login", {
          state: {
            movePath: location.pathname,
          },
        });
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
        return Promise.reject(error);
      }
      // 그냥 에러
      else {
        return Promise.reject(error);
      }
    }
  );
};

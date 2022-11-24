export const COM_MESSAGE = {
  // ECF : ERROR CRITICAL FAIL, 치명적인 오류
  ERR: {
    resultCode: "EC0001",
    resultMessage: "처리 중 문제가 발생하였습니다.",
  },
  ERR_NETWORK: {
    resultCode: "EC0002",
    resultMessage: "네트워크에 문제가 발생하였습니다.",
  },

  UNAUTHORIZED: {
    resultCode: "EP0004",
    resultMessage: "인증되지 않은 사용자입니다.",
  },

  EXPIRE_AUTHORIZED: {
    resultCode: "EP0006",
    resultMessage: "만료된 인증정보입니다.",
  },

  CANCEL_REQUEST: {
    resultCode: "OA0001",
    resultMessage: "취소요청이 발생하였습니다.",
  },

  /**
   * code 또는 com_meesage객체를 받아 코드가 일치하는 해당되는 객체를 반환
   * @param {*} code
   * @returns
   */
  getMessage: function (code) {
    if (typeof val == "string") {
      return Object.values(this).find((item) => item.resultCode === code);
    } else if (typeof val == "object") {
      return Object.values(this).find(
        (item) => item.resultCode === code.resultCode
      );
    }
    return null;
  },

  isMessage: function (code) {
    return !!this.getMessage(code);
  },
};

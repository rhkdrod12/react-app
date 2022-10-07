import axios from "axios";
import { Observable } from "rxjs";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { COM_MESSAGE } from "../utils/commonMessage";
import JSOG from "jsog";
import COM from "../utils/System.js";

export const DEFAULT_URL = "http://127.0.0.1:8080";

// axios instance를 만들어서 config 설정
export const axiosInstance = axios.create({
  timeout: COM.TIME_OUT,
  withCredentials: true,
});

/**
 * 입력한 URL에 param를 포함하여 GET요청을 보냄 (useState로 받음, 에러처리가 어려움)
 * @param {String} url 요청할 URL
 * @param {Object} param1 요청할 파라미터
 * @returns {Array<Object>}
 */
export const useGetFetch = (
  url,
  { stateType = [], param } = {},
  callbackFunc
) => {
  const [responseData, setResponseData] = useState(stateType);
  url = DEFAULT_URL + url;

  useEffect(() => {
    // 파라미터 삽입
    url = makeGetParam(url, param);

    axiosInstance
      .get(url)
      .then((res) => {
        const result = JSOG.parse(res.request.response).result;

        if (typeof callbackFunc === "function") callbackFunc(result);

        setResponseData(result);
      })
      .catch((error) => {
        console.log(axiosError(error));
      });
  }, [url]);

  return [responseData, setResponseData];
};

/**
 * 데이터를 요청하여 이를 useState로 받음, 에러처리를 하지 않기 때문에 잘해야함
 * @param url
 * @param data
 * @param stateType
 * @returns {(*[]|((value: (((prevState: *[]) => *[]) | *[])) => void))[]}
 */
export function usePostFetch(url, data, stateType = []) {
  const [responseData, setResponseData] = useState(stateType);
  url = DEFAULT_URL + url;
  useEffect(() => {
    axiosInstance
      .post(url, data)
      .then((res) => {
        let {
          data: { message },
        } = res;
        setResponseData(message);
      })
      .catch((error) => {
        console.log(axiosError(error));
      });
  }, [url]);

  return [responseData, setResponseData];
}

/**
 * url에 param을 get형태로 전송 또는 요청
 * @param url
 * @param param
 * @param callback
 * @returns {Promise<unknown>}
 */
export function getFetch(url, param, callback) {
  url = DEFAULT_URL + url;
  if (param && param instanceof Object) {
    url += "?" + queryString.stringify(param);
  }

  return new Promise((resolve, reject) => {
    axiosInstance
      .get(url)
      .then((res) => {
        resolve(JSOG.parse(res.request.response).result, res);
      })
      .catch((error) => {
        console.log(axiosError(error));
        reject(axiosError(error));
      });
  });
}

export function defaultFormFetch(url, data) {
  url = DEFAULT_URL + url;

  return new Promise((resolve, reject) => {
    axios
      .post(url, makeFormData(data), {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((res) => {
        const result = JSOG.parse(res.request.response).result;
        resolve(result);
      })
      .catch((error) => {
        reject(axiosError(error));
      });
  });
}

/**
 * url로 param을 formData형태로 전송
 * @param url
 * @param data
 * @returns {Promise<unknown>}
 */
export function formFetch(url, data) {
  url = DEFAULT_URL + url;

  return new Promise((resolve, reject) => {
    axiosInstance
      .post(url, makeFormData(data), {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((res) => {
        const result = JSOG.parse(res.request.response).result;
        resolve(result);
      })
      .catch((error) => {
        reject(axiosError(error));
      });
  });
}

export function postFetch(url, data) {
  url = DEFAULT_URL + url;

  return new Promise((resolve, reject) => {
    axiosInstance
      .post(url, data)
      .then((res) => {
        const result = JSOG.parse(res.request.response).result;
        resolve(result);
      })
      .catch((e) => {
        const { message, code } = e;
        console.log(e);
        console.log(`Messgae: ${message}\nCode: ${code}`);
        reject(axiosError(error));
      });
  });
}

/**
 * URL에 BODY에 데이터를 포함하여 POST요청을 한다.
 * @param {String} url
 * @param {Object} data
 */
export function rxJsPost(url, data) {
  url = DEFAULT_URL + url;
  return new Observable((observer) => {
    axiosInstance
      .post(url, data)
      .then(({ data }) => {
        observer.next(data);
        observer.complete();
      })
      .catch((e) => {
        axiosRxJsError(observer, e);
      });
  });
}

/**
 * 해당 URL로 파일 객체를 전송한다.
 * @param {String} url
 * @param {Object} fileInfo
 * @param {function} onUploadProgress
 * @returns
 */
export function fileRxjsUpload(url, fileInfo, onUploadProgress) {
  url = DEFAULT_URL + url;
  // 객체를 fromData 형태로 가공
  const formData = makeFormData(fileInfo, ["axiosSource"]);

  fileInfo.axiosSource = fileInfo.axiosSource ??=
    axiosInstance.CancelToken.source();

  const option = {
    url: url, // 파일 다운로드 요청 URL
    method: "POST", // 혹은 'POST'
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
    cancelToken: fileInfo.axiosSource.token,
    onUploadProgress: onUploadProgress,
  };

  return new Observable((observer) => {
    axiosInstance(option)
      .then((response) => {
        observer.next(response.data);
        observer.complete();
      })
      .catch((e) => {
        axiosRxJsError(observer, e);
      });
  });
}

/**
 * 파일 다운로드관련 패치
 * @param url
 * @param param
 * @param onDownloadProgress
 * @returns {Promise<unknown>}
 */
export function fileDownload(url, param, onDownloadProgress) {
  url = DEFAULT_URL + url;

  if (param && param instanceof Object) {
    url += "?" + queryString.stringify(param);
  }

  return new Promise((resolve, reject) => {
    const option = {
      url: url, // 파일 다운로드 요청 URL
      method: "GET", // 혹은 'POST'
      responseType: "blob", // 응답 데이터 타입 정의
      onDownloadProgress: onDownloadProgress,
    };
    // 서버에서 받은 데이터는 바이너리 형태의 데이터가 됨
    // 따라서 이 것을 blod로 변환한다음 다운로드를 실시함?
    axiosInstance(option)
      .then((response) => {
        const blob = new Blob([response.data]); // blob을 사용해 객체 URL을 생성합니다.
        const fileObjectUrl = window.URL.createObjectURL(blob); // blob 객체 URL을 설정할 링크를 만듭니다.

        const extractDownloadFilename = (response) => {
          const disposition = response.headers["content-disposition"];
          const fileName = decodeURI(
            disposition
              .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
              .replace(/['"]/g, "")
          );
          return fileName;
        }; // 다운로드 파일의 이름은 직접 지정 할 수 있습니다. // link.download = "sample-file.xlsx"; // 링크를 body에 추가하고 강제로 click 이벤트를 발생시켜 파일 다운로드를 실행시킵니다.

        const link = document.createElement("a");
        link.href = fileObjectUrl;
        link.style.display = "none"; // 다운로드 파일 이름을 지정 할 수 있습니다. // 일반적으로 서버에서 전달해준 파일 이름은 응답 Header의 Content-Disposition에 설정됩니다.

        link.download = extractDownloadFilename(response); // 다운로드 파일 이름을 추출하는 함수
        // link.download = extractDownloadFilename(response); // 다운로드 파일 이름을 추출하는 함수

        document.body.appendChild(link);
        link.click();
        link.remove(); // 다운로드가 끝난 리소스(객체 URL)를 해제합니다.

        window.URL.revokeObjectURL(fileObjectUrl);

        resolve(true);
      })
      .catch((e) => {
        console.log(axiosError(e));
        reject(axiosError(e));
      });
  });
}

/**
 * param을 formData로 변환
 * @param arg
 * @param exclude
 * @returns {FormData}
 */
export const makeFormData = function (arg, exclude = []) {
  const formData = new FormData();
  for (const key in arg) {
    if (!exclude.includes(key)) formData.append(key, arg[key]);
  }
  return formData;
};

/**
 * URL에 파라미터를 주입
 * @param {String} url
 * @param {Object} param
 * @returns
 */
export const makeGetParam = (url, param) => {
  return param && param instanceof Object
    ? url + "?" + queryString.stringify(param)
    : url;
};

/***************************** 에러 메시지 관련  ****************************/
/**
 * rxJx의 axios에 의해 발생하는 에러메시지 처리
 * @param {*} observer
 * @param {*} error
 */
export const axiosRxJsError = (observer, error) => {
  if (error.code) {
    if (error.name == "AxiosError") {
      if (error.code == "ERR_NETWORK") {
        observer.error({ result: false, ...COM_MESSAGE.ERR_NETWORK });
      } else if (error.code == "ERR_BAD_RESPONSE") {
        observer.error(error.response.data);
      } else if (error.code == "ERR_BAD_REQUEST") {
        observer.error(error.response.data);
      } else {
        observer.error({ result: false, ...COM_MESSAGE.ERR });
      }
    } else if (error.name == "CanceledError") {
      if (error.code == "ERR_CANCELED") {
        observer.error({ result: false, ...COM_MESSAGE.CANCEL_REQUEST });
      }
    }
  }
};

/**
 * axios 통신시 발생하는 에러메시지 처리
 * @param {*} error
 */
export const axiosError = (error) => {
  if (error.code) {
    if (error.name == "AxiosError") {
      if (error.code == "ERR_NETWORK") {
        return { result: false, ...COM_MESSAGE.ERR_NETWORK };
      } else if (error.code == "ERR_BAD_RESPONSE") {
        return error.response.data;
      } else if (error.code == "ERR_BAD_REQUEST") {
        return error.response.data;
      } else {
        return { result: false, ...COM_MESSAGE.ERR };
      }
    } else if (error.name == "CanceledError") {
      if (error.code == "ERR_CANCELED") {
        return { result: false, ...COM_MESSAGE.CANCEL_REQUEST };
      }
    }
  }
};
/***************************** ********* ****************************/

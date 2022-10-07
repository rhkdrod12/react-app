/**
 * FILE 전송 코드
 * @type {{PREPARE: number, PROGRESS: number, CANCEL: number, ERROR: number, FAIL: number, FINISH: number}}
 */
export const FILE_TRANS = {
  PREPARE: 0, // 대기
  PROGRESS: 1, // 전송
  FINISH: 2, // 완료
  FAIL: 3, // 실패
  CANCEL: 4, // 취소
  ERROR: 5, // 오류
};

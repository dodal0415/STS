package org.ex.back.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "ACCOUNT-001", "사용자를 찾을 수 없습니다."),
    HAS_ID(HttpStatus.BAD_REQUEST, "ACCOUNT-002", "동일한 ID가 이미 존재합니다."),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "ACCOUNT-003", "비밀번호가 일치하지 않습니다."),
    RELOGIN_REQUIRED(HttpStatus.BAD_REQUEST, "ACCOUNT-004", "재로그인이 필요합니다."),
    TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "ACCOUNT-005", "헤더에 토큰이 없습니다."),
    PHONE_NUMBER_NOT_VERIFIED(HttpStatus.BAD_REQUEST, "ACCOUNT-006", "인증된 전화번호를 가지고 있지 않습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
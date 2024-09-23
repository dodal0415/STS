package org.ex.back.domain.waiting.dto;

public class WaitingResponseDto {

    private Integer waitingPk;
    private Integer storePk;

    private String phone; //전화번호
    private Integer headCount; //인원수
    private Integer waitingState; //대기, 입장, 취소
    private Integer waitingOrder; //대기 순번 1, 2, 3 ...
}
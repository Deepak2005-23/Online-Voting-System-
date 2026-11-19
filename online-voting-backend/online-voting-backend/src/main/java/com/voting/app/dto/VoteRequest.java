package com.voting.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VoteRequest {

    @NotNull(message = "Candidate id is required")
    private Long candidateId;
}

package com.voting.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CandidateRequest {

    @NotBlank(message = "Candidate name is required")
    private String candidateName;

    private String tamilName;

    private String party;

    private String symbol;

    private String symbolIcon;

    private String partyColor;

    private String constituency;

    private Integer age;

    private String education;

    private String alliance;

    private String role;

    private String manifesto;

    private String photo;
}

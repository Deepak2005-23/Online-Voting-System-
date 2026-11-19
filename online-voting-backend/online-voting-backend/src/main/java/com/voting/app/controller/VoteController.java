package com.voting.app.controller;

import com.voting.app.dto.VoteRequest;
import com.voting.app.entity.Vote;
import com.voting.app.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/vote")
    public ResponseEntity<Vote> castVote(@Valid @RequestBody VoteRequest request, Authentication authentication) {
        String voterEmail = authentication.getName();
        Vote vote = voteService.castVote(voterEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(vote);
    }

    @GetMapping("/results")
    public ResponseEntity<Map<String, Object>> getResults() {
        return ResponseEntity.ok(voteService.getResults());
    }
}

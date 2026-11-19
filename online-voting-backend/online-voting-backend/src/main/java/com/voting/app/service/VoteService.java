package com.voting.app.service;

import com.voting.app.dto.VoteRequest;
import com.voting.app.entity.Candidate;
import com.voting.app.entity.User;
import com.voting.app.entity.Vote;
import com.voting.app.exception.ApiException;
import com.voting.app.repository.CandidateRepository;
import com.voting.app.repository.UserRepository;
import com.voting.app.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;

    @Transactional
    public Vote castVote(String voterEmail, VoteRequest request) {
        User voter = userRepository.findByEmail(voterEmail)
                .orElseThrow(() -> new ApiException("Voter not found"));

        if (voter.isVoted()) {
            throw new ApiException("You have already voted. Duplicate voting is not allowed.");
        }

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ApiException("Candidate not found"));

        Vote vote = Vote.builder()
                .voterId(voter.getId())
                .candidateId(candidate.getId())
                .build();

        voteRepository.save(vote);

        candidate.setVoteCount(candidate.getVoteCount() + 1);
        candidateRepository.save(candidate);

        voter.setVoted(true);
        userRepository.save(voter);

        return vote;
    }

    public Map<String, Object> getResults() {
        List<Candidate> candidates = candidateRepository.findAll();
        int totalVotes = candidates.stream().mapToInt(Candidate::getVoteCount).sum();

        List<Map<String, Object>> resultList = candidates.stream().map(c -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("candidateId", c.getId());
            map.put("candidateName", c.getCandidateName());
            map.put("tamilName", c.getTamilName());
            map.put("party", c.getParty());
            map.put("symbol", c.getSymbol());
            map.put("symbolIcon", c.getSymbolIcon());
            map.put("partyColor", c.getPartyColor());
            map.put("constituency", c.getConstituency());
            map.put("voteCount", c.getVoteCount());
            double percentage = totalVotes == 0 ? 0 : (c.getVoteCount() * 100.0) / totalVotes;
            map.put("percentage", Math.round(percentage * 100.0) / 100.0);
            return map;
        }).collect(Collectors.toList());

        return Map.of(
                "totalVotes", totalVotes,
                "results", resultList
        );
    }
}

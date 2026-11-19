package com.voting.app.service;

import com.voting.app.entity.Election;
import com.voting.app.exception.ApiException;
import com.voting.app.repository.ElectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public Election createElection(Election election) {
        return electionRepository.save(election);
    }

    public Election updateElection(Long id, Election updated) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new ApiException("Election not found"));
        election.setElectionName(updated.getElectionName());
        election.setStartDate(updated.getStartDate());
        election.setEndDate(updated.getEndDate());
        election.setStatus(updated.getStatus());
        return electionRepository.save(election);
    }

    public void deleteElection(Long id) {
        electionRepository.deleteById(id);
    }
}

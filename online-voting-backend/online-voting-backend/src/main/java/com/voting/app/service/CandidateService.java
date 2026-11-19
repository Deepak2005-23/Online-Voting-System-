package com.voting.app.service;

import com.voting.app.dto.CandidateRequest;
import com.voting.app.entity.Candidate;
import com.voting.app.exception.ApiException;
import com.voting.app.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new ApiException("Candidate not found with id: " + id));
    }

    public Candidate addCandidate(CandidateRequest request) {
        Candidate candidate = Candidate.builder()
                .candidateName(request.getCandidateName())
                .tamilName(request.getTamilName())
                .party(request.getParty())
                .symbol(request.getSymbol())
                .symbolIcon(request.getSymbolIcon())
                .partyColor(request.getPartyColor())
                .constituency(request.getConstituency())
                .age(request.getAge())
                .education(request.getEducation())
                .alliance(request.getAlliance())
                .role(request.getRole())
                .manifesto(request.getManifesto())
                .photo(request.getPhoto())
                .voteCount(0)
                .build();
        return candidateRepository.save(candidate);
    }

    public Candidate updateCandidate(Long id, CandidateRequest request) {
        Candidate candidate = getCandidateById(id);
        candidate.setCandidateName(request.getCandidateName());
        candidate.setTamilName(request.getTamilName());
        candidate.setParty(request.getParty());
        candidate.setSymbol(request.getSymbol());
        candidate.setSymbolIcon(request.getSymbolIcon());
        candidate.setPartyColor(request.getPartyColor());
        candidate.setConstituency(request.getConstituency());
        candidate.setAge(request.getAge());
        candidate.setEducation(request.getEducation());
        candidate.setAlliance(request.getAlliance());
        candidate.setRole(request.getRole());
        candidate.setManifesto(request.getManifesto());
        candidate.setPhoto(request.getPhoto());
        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(Long id) {
        Candidate candidate = getCandidateById(id);
        candidateRepository.delete(candidate);
    }
}

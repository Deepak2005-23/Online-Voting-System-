package com.voting.app.repository;

import com.voting.app.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByVoterId(Long voterId);
    List<Vote> findByCandidateId(Long candidateId);
}

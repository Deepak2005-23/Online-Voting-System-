package com.voting.app.controller;

import com.voting.app.entity.Election;
import com.voting.app.service.ElectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    @GetMapping
    public ResponseEntity<List<Election>> getAllElections() {
        return ResponseEntity.ok(electionService.getAllElections());
    }

    @PostMapping
    public ResponseEntity<Election> createElection(@RequestBody Election election) {
        return ResponseEntity.status(HttpStatus.CREATED).body(electionService.createElection(election));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Election> updateElection(@PathVariable Long id, @RequestBody Election election) {
        return ResponseEntity.ok(electionService.updateElection(id, election));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElection(@PathVariable Long id) {
        electionService.deleteElection(id);
        return ResponseEntity.noContent().build();
    }
}

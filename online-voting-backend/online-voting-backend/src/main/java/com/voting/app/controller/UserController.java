package com.voting.app.controller;

import com.voting.app.entity.User;
import com.voting.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/voters")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // Admin: view all registered voters
    @GetMapping
    public ResponseEntity<List<User>> getAllVoters() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}

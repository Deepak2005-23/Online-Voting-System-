package com.voting.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "elections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String electionName;

    private LocalDate startDate;

    private LocalDate endDate;

    // ACTIVE, CLOSED, UPCOMING
    @Builder.Default
    private String status = "ACTIVE";
}

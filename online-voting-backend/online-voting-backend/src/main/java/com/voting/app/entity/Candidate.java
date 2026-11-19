package com.voting.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
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

    @Column(length = 1500)
    private String manifesto;

    private String photo;

    @Builder.Default
    @Column(nullable = false)
    private int voteCount = 0;
}

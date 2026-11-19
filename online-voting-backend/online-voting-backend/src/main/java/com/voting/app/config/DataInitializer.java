package com.voting.app.config;

import com.voting.app.entity.Candidate;
import com.voting.app.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CandidateRepository candidateRepository;

    @Override
    public void run(String... args) {
        if (candidateRepository.count() == 0) {
            log.info("Seeding Tamil Nadu Election 2026 Candidates...");

            List<Candidate> candidates = List.of(
                Candidate.builder()
                    .candidateName("M. K. Stalin")
                    .tamilName("மு. க. ஸ்டாலின்")
                    .party("DMK")
                    .symbol("Rising Sun")
                    .symbolIcon("🌅")
                    .partyColor("#dc2626")
                    .constituency("Kolathur (Chennai)")
                    .age(71)
                    .education("B.A. History, Presidency College")
                    .alliance("Secular Progressive Alliance (SPA / INDIA)")
                    .role("Chief Minister of Tamil Nadu & DMK President")
                    .manifesto("Dravidian Model governance, Kalaignar Magalir Urimai Thittam monthly ₹1000 assistance, free travel for women in city buses, CM breakfast scheme across schools, ₹10 Lakh Crore industrial tech investments.")
                    .voteCount(1420)
                    .build(),

                Candidate.builder()
                    .candidateName("Edappadi K. Palaniswami (EPS)")
                    .tamilName("எடப்பாடி கே. பழனிசாமி")
                    .party("AIADMK")
                    .symbol("Two Leaves")
                    .symbolIcon("🍃")
                    .partyColor("#16a34a")
                    .constituency("Edappadi (Salem)")
                    .age(70)
                    .education("B.Sc, Sri Vasavi College")
                    .alliance("AIADMK Democratic Alliance")
                    .role("Leader of the Opposition & AIADMK General Secretary")
                    .manifesto("Kudimaramathu water bodies revival, 24/7 free agricultural electricity, modernization of Amma Canteens across all districts, 7.5% preferential medical quota for government school students.")
                    .voteCount(1310)
                    .build(),

                Candidate.builder()
                    .candidateName("K. Annamalai")
                    .tamilName("கே. அண்ணாமலை")
                    .party("BJP")
                    .symbol("Lotus")
                    .symbolIcon("🪷")
                    .partyColor("#ea580c")
                    .constituency("Coimbatore South")
                    .age(40)
                    .education("B.E. Mechanical (PSG Tech), MBA (IIM Lucknow), Former IPS")
                    .alliance("National Democratic Alliance (NDA)")
                    .role("State President, Tamil Nadu BJP")
                    .manifesto("En Mann En Makkal transparent public governance, direct digital welfare transfer eliminating intermediaries, establishing premier defense & electronics industrial corridors in tier-2/3 TN towns.")
                    .voteCount(980)
                    .build(),

                Candidate.builder()
                    .candidateName("Thalapathy Vijay")
                    .tamilName("தளபதி விஜய்")
                    .party("TVK")
                    .symbol("Whistle / Victory Elephant")
                    .symbolIcon("🎺")
                    .partyColor("#b91c1c")
                    .constituency("Tamil Nadu Statewide")
                    .age(50)
                    .education("Visual Communications, Loyola College")
                    .alliance("Tamilaga Vettri Kazhagam (Independent)")
                    .role("Party Founder & President")
                    .manifesto("Pirapokkum Ella Uyirkkum equality by birth, 100% free quality public education and healthcare, strict eradication of illicit liquor and narcotics, women safety force in every municipal ward.")
                    .voteCount(1540)
                    .build(),

                Candidate.builder()
                    .candidateName("Seeman")
                    .tamilName("செந்தமிழன் சீமான்")
                    .party("NTK")
                    .symbol("Sugarcane Farmer")
                    .symbolIcon("🌾")
                    .partyColor("#15803d")
                    .constituency("Thiruvottiyur (Chennai)")
                    .age(57)
                    .education("B.Com")
                    .alliance("Naam Tamilar Katchi (Standalone)")
                    .role("Chief Coordinator, Naam Tamilar Katchi")
                    .manifesto("Ecological politics prioritizing organic farming as core state infrastructure, 50% reserved tickets for women candidates, complete ban on corporate exploitation of water and sand resources.")
                    .voteCount(870)
                    .build(),

                Candidate.builder()
                    .candidateName("Thol. Thirumavalavan")
                    .tamilName("தொல். திருமாவளவன்")
                    .party("VCK")
                    .symbol("Pot")
                    .symbolIcon("🏺")
                    .partyColor("#2563eb")
                    .constituency("Chidambaram")
                    .age(62)
                    .education("M.A., B.L., Ph.D, University of Madras")
                    .alliance("Secular Progressive Alliance (SPA)")
                    .role("Member of Parliament (Lok Sabha) & VCK President")
                    .manifesto("Constitutional safeguards & social equality, eradication of caste discrimination, special socio-economic development funds for marginalized communities, strengthening state federal autonomy.")
                    .voteCount(760)
                    .build(),

                Candidate.builder()
                    .candidateName("NOTA (None of the Above)")
                    .tamilName("நோட்டா (யாருமில்லை)")
                    .party("ECI")
                    .symbol("NOTA Ballot Stamp")
                    .symbolIcon("🗳️")
                    .partyColor("#64748b")
                    .constituency("All Constituencies")
                    .age(null)
                    .education("Constitutional Right")
                    .alliance("Neutral Electoral Option")
                    .role("Right of Electoral Dissent")
                    .manifesto("Empowering voters with the democratic right to reject all nominated candidates in this ballot if none align with their expectations.")
                    .voteCount(120)
                    .build()
            );

            candidateRepository.saveAll(candidates);
            log.info("Successfully seeded {} Tamil Nadu candidates.", candidates.size());
        }
    }
}


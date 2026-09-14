package com.testing.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "social_link")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SocialLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String platform;

    @Column(nullable = false)
    private String url;
}

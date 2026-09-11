package com.testing.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "date_label")
    private String dateLabel;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String technologies;
}
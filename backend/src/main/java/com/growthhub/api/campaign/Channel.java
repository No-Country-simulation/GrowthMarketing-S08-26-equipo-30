package com.growthhub.api.campaign; // Revisa que coincida con tu package real

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "channels")
@Getter
@Setter
@NoArgsConstructor
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false, unique = true)
    private String name;

    public Channel(String name) {
        this.name = name;
    }
}
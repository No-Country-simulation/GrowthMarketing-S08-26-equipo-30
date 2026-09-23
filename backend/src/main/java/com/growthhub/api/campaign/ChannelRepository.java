package com.growthhub.api.campaign;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChannelRepository extends JpaRepository<Channel, Long> {

	Optional<Channel> findByNameIgnoreCase(String name);
}
package com.growthhub.api.user;

import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.EventRepository;
import com.growthhub.api.user.dto.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final EventRepository eventRepository;

	public UserService(UserRepository userRepository, EventRepository eventRepository) {
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
	}

	@Transactional(readOnly = true)
	public List<UserResponse> listUsers() {
		return userRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public UserResponse getUser(String id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
		return toResponse(user);
	}

	private UserResponse toResponse(User user) {
		FunnelStage currentStage = eventRepository.findDistinctStagesByUserId(user.getId()).stream()
				.max(Comparator.comparingInt(Enum::ordinal))
				.orElse(null);
		return new UserResponse(user.getId(), user.isDemo(), currentStage);
	}
}
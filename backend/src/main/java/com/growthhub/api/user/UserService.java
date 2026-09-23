package com.growthhub.api.user;

import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.shared.FunnelStageResolver;
import com.growthhub.api.tracking.EventRepository;
import com.growthhub.api.user.dto.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final EventRepository eventRepository;
	private final FunnelStageResolver funnelStageResolver;

	public UserService(UserRepository userRepository, EventRepository eventRepository,
			FunnelStageResolver funnelStageResolver) {
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
		this.funnelStageResolver = funnelStageResolver;
	}

	@Transactional(readOnly = true)
	public List<UserResponse> listUsers() {
		Map<String, Set<FunnelStage>> stagesByUser = new HashMap<>();
		for (Object[] row : eventRepository.findDistinctUserStages()) {
			stagesByUser.computeIfAbsent((String) row[0], key -> new HashSet<>()).add((FunnelStage) row[1]);
		}
		return userRepository.findAll().stream()
				.map(user -> new UserResponse(user.getId(), user.isDemo(),
						funnelStageResolver.currentStage(stagesByUser.get(user.getId()))))
				.toList();
	}

	@Transactional(readOnly = true)
	public UserResponse getUser(String id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
		return toResponse(user);
	}

	private UserResponse toResponse(User user) {
		FunnelStage currentStage = funnelStageResolver.currentStage(
				eventRepository.findDistinctStagesByUserId(user.getId()));
		return new UserResponse(user.getId(), user.isDemo(), currentStage);
	}
}
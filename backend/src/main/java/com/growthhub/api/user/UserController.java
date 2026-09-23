package com.growthhub.api.user;

import com.growthhub.api.user.dto.UserResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public List<UserResponse> listUsers() {
		return userService.listUsers();
	}

	@GetMapping("/{id}")
	public UserResponse getUser(@PathVariable String id) {
		return userService.getUser(id);
	}
}
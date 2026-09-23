package com.growthhub.api.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "funnel_users")
@Getter
@Setter
public class User {

	@Id
	@Column(nullable = false)
	private String id;

	@Column(name = "is_demo", nullable = false)
	private boolean demo = false;
}
package com.growthhub.api.shared;

public final class UuidHexGenerator {

	private UuidHexGenerator() {
	}

	public static String newId() {
		return java.util.UUID.randomUUID().toString().replace("-", "").toUpperCase();
	}
}
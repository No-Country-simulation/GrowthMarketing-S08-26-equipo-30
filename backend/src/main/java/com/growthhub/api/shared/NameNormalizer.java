package com.growthhub.api.shared;

public final class NameNormalizer {

	private NameNormalizer() {
	}

	public static String normalize(String name) {
		if (name == null || name.isBlank()) {
			return "";
		}
		String result = name.trim().toLowerCase();
		result = result.replaceAll("[^a-z0-9\\s]", "");
		result = result.replaceAll("\\s+", "_");
		return result;
	}
}
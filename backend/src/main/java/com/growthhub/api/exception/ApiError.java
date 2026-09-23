package com.growthhub.api.exception;

public class ApiError {
	private int status;
	private String error;
	private String message;
	private String path;
	private java.time.Instant timestamp;

	public ApiError() {
		this.timestamp = java.time.Instant.now();
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public java.time.Instant getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(java.time.Instant timestamp) {
		this.timestamp = timestamp;
	}
}
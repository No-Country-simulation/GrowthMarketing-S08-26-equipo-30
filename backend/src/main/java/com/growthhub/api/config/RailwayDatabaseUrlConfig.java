package com.growthhub.api.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.jdbc.autoconfigure.JdbcConnectionDetails;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class RailwayDatabaseUrlConfig {

	@Bean
	@ConditionalOnMissingBean(JdbcConnectionDetails.class)
	@ConditionalOnExpression("'${DATABASE_URL:}' != '' && '${SPRING_DATASOURCE_URL:}' == ''")
	public JdbcConnectionDetails railwayJdbcConnectionDetails() {
		return parseDatabaseUrl(System.getenv("DATABASE_URL"));
	}

	private JdbcConnectionDetails parseDatabaseUrl(String databaseUrl) {
		if (databaseUrl.startsWith("jdbc:")) {
			return new RailwayJdbcConnectionDetails(databaseUrl, null, null);
		}
		try {
			URI uri = new URI(databaseUrl);
			String[] credentials = parseCredentials(uri.getUserInfo());
			String query = uri.getQuery() == null ? "" : "?" + uri.getQuery();
			String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + resolvePort(uri) + uri.getPath() + query;
			return new RailwayJdbcConnectionDetails(jdbcUrl, credentials[0], credentials[1]);
		} catch (URISyntaxException ex) {
			throw new IllegalStateException("DATABASE_URL no tiene un formato valido", ex);
		}
	}

	private int resolvePort(URI uri) {
		return uri.getPort() == -1 ? 5432 : uri.getPort();
	}

	private String[] parseCredentials(String userInfo) {
		if (userInfo == null || userInfo.isBlank()) {
			return new String[] { null, null };
		}
		String[] parts = userInfo.split(":", 2);
		return new String[] { decode(parts[0]), parts.length > 1 ? decode(parts[1]) : "" };
	}

	private String decode(String value) {
		return URLDecoder.decode(value, StandardCharsets.UTF_8);
	}

	private record RailwayJdbcConnectionDetails(String jdbcUrl, String username, String password)
			implements JdbcConnectionDetails {

		@Override
		public String getJdbcUrl() {
			return jdbcUrl;
		}

		@Override
		public String getUsername() {
			return username;
		}

		@Override
		public String getPassword() {
			return password;
		}

		@Override
		public String getDriverClassName() {
			return "org.postgresql.Driver";
		}
	}
}

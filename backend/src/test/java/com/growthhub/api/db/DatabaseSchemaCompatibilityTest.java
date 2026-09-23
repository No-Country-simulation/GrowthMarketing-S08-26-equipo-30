package com.growthhub.api.db;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifica que backend/db/base-de-datos-mvp.sql (el esquema de referencia del MVP)
 * se ejecuta realmente sobre H2 y define la estructura que los módulos de user,
 * tracking y analytics asumen.
 *
 * Nota 1: las pruebas con Hibernate generan el esquema desde las entidades JPA y no
 * cubren ni la tabla funnel_stages ni la FK funnel_events.stage -> funnel_stages.key;
 * este test ejecuta el SQL real para comprobar esa parte del contrato.
 *
 * Nota 2: H2 2.x trata "key" como palabra reservada. El esquema usa la columna
 * "key" sin comillas, por lo que solo se ejecuta en H2 con la opción
 * NON_KEYWORDS=KEY (o comillas dobles). En PostgreSQL "key" no es reservada y el
 * esquema corre sin cambios. Esta limitación queda documentada para el equipo.
 */
class DatabaseSchemaCompatibilityTest {

	private static final String SCHEMA_PATH = "db/base-de-datos-mvp.sql";
	private static final String H2_URL =
			"jdbc:h2:mem:schema_check;DB_CLOSE_DELAY=-1;NON_KEYWORDS=KEY";

	@Test
	void mvpSchemaExecutesOnH2AndDefinesTrackingTables() throws Exception {
		Path sqlPath = Path.of(SCHEMA_PATH);
		assertThat(Files.exists(sqlPath)).as("esquema SQL de referencia existe").isTrue();

		String script = Files.readString(sqlPath);

		try (Connection conn = DriverManager.getConnection(H2_URL, "sa", "")) {
			ScriptUtils.executeSqlScript(conn,
					new EncodedResource(new ByteArrayResource(script.getBytes(StandardCharsets.UTF_8))));

			DatabaseMetaData meta = conn.getMetaData();
			for (String table : List.of("campaigns", "channels", "campaign_channels", "funnel_users",
					"funnel_stages", "funnel_events", "campaign_metrics", "experiments",
					"experiment_variants")) {
				assertThat(tableExists(meta, table)).as("tabla %s creada por el SQL", table).isTrue();
			}

			assertThat(countRows(conn, "funnel_stages")).as("funnel_stages tiene las seis etapas").isEqualTo(6);

			assertThat(funnelEventsStageReferencesFunnelStages(meta)).as(
					"funnel_events.stage es FK a funnel_stages.key").isTrue();
		}
	}

	private boolean tableExists(DatabaseMetaData meta, String table) throws Exception {
		try (ResultSet rs = meta.getTables(null, null, table.toUpperCase(), new String[] { "TABLE" })) {
			return rs.next();
		}
	}

	private int countRows(Connection conn, String table) throws Exception {
		try (Statement st = conn.createStatement();
				ResultSet rs = st.executeQuery("select count(*) from " + table)) {
			rs.next();
			return rs.getInt(1);
		}
	}

	private boolean funnelEventsStageReferencesFunnelStages(DatabaseMetaData meta) throws Exception {
		try (ResultSet rs = meta.getImportedKeys(null, null, "FUNNEL_EVENTS")) {
			while (rs.next()) {
				boolean pkTable = "FUNNEL_STAGES".equalsIgnoreCase(rs.getString("PKTABLE_NAME"));
				boolean fkColumn = "STAGE".equalsIgnoreCase(rs.getString("FKCOLUMN_NAME"));
				boolean pkColumn = "KEY".equalsIgnoreCase(rs.getString("PKCOLUMN_NAME"));
				if (pkTable && fkColumn && pkColumn) {
					return true;
				}
			}
			return false;
		}
	}
}
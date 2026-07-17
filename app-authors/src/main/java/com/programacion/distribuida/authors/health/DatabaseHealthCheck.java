package com.programacion.distribuida.authors.health;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.Readiness;

import javax.sql.DataSource;
import java.sql.Connection;

@Liveness
@Readiness
@ApplicationScoped
public class DatabaseHealthCheck implements HealthCheck {

    @Inject
    DataSource dataSource;

    @Override
    public HealthCheckResponse call() {
        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(2);
            if (valid) {
                return HealthCheckResponse.named("Database connection")
                        .withData("database", "PostgreSQL")
                        .up()
                        .build();
            }
            return HealthCheckResponse.named("Database connection").down().build();
        } catch (Exception e) {
            return HealthCheckResponse.named("Database connection")
                    .withData("error", e.getMessage())
                    .down()
                    .build();
        }
    }
}
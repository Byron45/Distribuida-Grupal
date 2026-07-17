package com.programacion.distribuida.books.health;

import com.programacion.distribuida.books.clients.AuthorRestClient;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@Readiness
@ApplicationScoped
public class AuthorsServiceHealthCheck implements HealthCheck {

    @Inject
    @RestClient
    AuthorRestClient authorRestClient;

    @Override
    public HealthCheckResponse call() {
        try {
            authorRestClient.findAll();
            return HealthCheckResponse.named("Authors service")
                    .withData("service", "app-authors")
                    .up()
                    .build();
        } catch (Exception e) {
            return HealthCheckResponse.named("Authors service")
                    .withData("service", "app-authors")
                    .withData("motivo", "app-authors no disponible / circuito abierto")
                    .down()
                    .build();
        }
    }
}
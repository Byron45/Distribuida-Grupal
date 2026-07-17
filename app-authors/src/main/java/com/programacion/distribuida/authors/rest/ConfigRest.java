package com.programacion.distribuida.authors.rest;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Optional;

@Path("/config")
public class ConfigRest {

    @ConfigProperty(name = "quarkus.http.port", defaultValue = "8070")
    Integer port;

    @GET
    public String test() {
        Config config = ConfigProvider.getConfig();

        config.getConfigSources().forEach(it ->
                System.out.printf("[%d]\t %s%n", it.getOrdinal(), it.getName()));

        String url = config.getValue("quarkus.datasource.jdbc.url", String.class);
        Optional<String> appName = config.getOptionalValue("app.name", String.class);

        System.out.println("--------------------------");
        System.out.println("URL datasource: " + url);
        System.out.println("App name: " + appName.orElse("NO EXISTE"));
        System.out.println("Puerto (DI): " + port);

        return "ok";
    }
}
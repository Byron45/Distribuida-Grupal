package com.programacion.distribuida.books;

import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import io.vertx.core.Vertx;
import io.vertx.ext.consul.CheckOptions;
import io.vertx.ext.consul.ConsulClient;
import io.vertx.ext.consul.ConsulClientOptions;
import io.vertx.ext.consul.ServiceOptions;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.InetAddress;
import java.util.List;

@ApplicationScoped
public class BookLifecycle {

    @Inject
    @ConfigProperty(name = "consul.host", defaultValue = "127.0.0.1")
    String consulHost;

    @Inject
    @ConfigProperty(name = "consul.port", defaultValue = "8500")
    Integer consulPort;

    @Inject
    @ConfigProperty(name = "quarkus.http.port", defaultValue = "8080")
    Integer appPort;

    String serviceId;

    public void init(@Observes StartupEvent event, Vertx vertx) {
        try {
            System.out.println("BookLifecycle init");
            ConsulClientOptions options = new ConsulClientOptions()
                    .setHost(consulHost)
                    .setPort(consulPort);
            ConsulClient client = ConsulClient.create(vertx, options);
            String ipAddress = InetAddress.getLocalHost().getHostAddress();

            serviceId = "app-books-%s:%d".formatted(ipAddress, appPort);

            var urlCheck = "http://%s:%d/q/health/live".formatted(ipAddress, appPort);
            CheckOptions checkOptions = new CheckOptions()
                    .setHttp(urlCheck)
                    .setInterval("10s")
                    .setDeregisterAfter("1m");

            var tags = List.of(
                    "traefik.enable=true",
                    "traefik.http.routers.router-app-books.rule=PathPrefix(`/app-books`)",
                    "traefik.http.routers.router-app-books.middlewares=middleware-books",
                    "traefik.http.middlewares.middleware-books.stripprefix.prefixes=/app-books"
            );

            ServiceOptions serviceOptions = new ServiceOptions()
                    .setName("app-books")
                    .setId(serviceId)
                    .setAddress(ipAddress)
                    .setPort(appPort)
                    .setCheckOptions(checkOptions)
                    .setTags(tags);

            client.registerService(serviceOptions)
                    .onSuccess(it -> System.out.println("Books service registrado en Consul con ID " + serviceId))
                    .onFailure(it -> System.out.println("Fallo al registrar app-books en Consul: " + it.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void destroy(@Observes ShutdownEvent event, Vertx vertx) {
        System.out.println("BookLifecycle destroy");
        ConsulClientOptions options = new ConsulClientOptions()
                .setHost(consulHost)
                .setPort(consulPort);
        ConsulClient client = ConsulClient.create(vertx, options);
        client.deregisterService(serviceId)
                .onSuccess(it -> System.out.println("Books service des-registrado de Consul: " + serviceId))
                .onFailure(it -> System.out.println("Fallo al des-registrar app-books: " + it.getMessage()));
    }
}
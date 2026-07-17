package com.programacion.distribuida.books.clients;

import com.programacion.distribuida.books.dtos.AuthorDto;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.faulttolerance.Fallback;
import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Path("/authors")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RegisterRestClient(baseUri = "stork://authors-api")
public interface AuthorRestClient {

    @GET
    @Path("/find/{isbn}")
    @Retry(maxRetries = 2, delay = 1000)
    @CircuitBreaker(
            requestVolumeThreshold = 3,
            failureRatio = 1.0,
            delay = 5,
            delayUnit = ChronoUnit.SECONDS
    )
    @Fallback(fallbackMethod = "findByBookFallback")
    List<AuthorDto> findByBook(@PathParam("isbn") String isbn);

    default List<AuthorDto> findByBookFallback(String isbn) {
        System.out.println("Fallback activado para isbn: " + isbn);
        return List.of(AuthorDto.builder()
                .id(-1)
                .name("Autor no disponible")
                .build());
    }

    @GET
    List<AuthorDto> findAll();
}
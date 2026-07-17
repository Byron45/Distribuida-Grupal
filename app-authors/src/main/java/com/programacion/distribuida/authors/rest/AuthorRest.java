package com.programacion.distribuida.authors.rest;

import com.programacion.distribuida.authors.db.Author;
import com.programacion.distribuida.authors.dtos.AuthorDto;
import com.programacion.distribuida.authors.repo.AuthorRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Path("/authors")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthorRest {

    @Inject
    AuthorRepository authorRepository;

    @Inject
    @ConfigProperty(name = "quarkus.http.port")
    Integer httpPort;

    AtomicInteger counter = new AtomicInteger(1);

    @GET
    public List<Author> getAll() {
        return authorRepository.listAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Integer id) {
        return authorRepository.findByIdOptional(id)
                .map(it -> {
                    it.setName(it.getName() + " - " + httpPort);
                    return it;
                })
                .map(Response::ok)
                .orElse(Response.status(Response.Status.NOT_FOUND))
                .build();
    }

    @GET
    @Path("/find/{isbn}")
    public List<AuthorDto> findByBook(@PathParam("isbn") String isbn) {
        int valor = counter.getAndIncrement();

        if (valor % 5 != 0) {
            String msg = "Intento %d -- generando error".formatted(valor);
            System.out.println(msg);
            throw new RuntimeException(msg);
        }

        return authorRepository.findByBook(isbn)
                .stream()
                .peek(it -> it.setName(it.getName() + " - " + httpPort))
                .map(it -> AuthorDto.builder()
                        .id(it.getId())
                        .name(it.getName())
                        .build())
                .toList();
    }

    @POST
    @Transactional
    public Response create(Author author) {
        authorRepository.persist(author);
        return Response.status(Response.Status.CREATED).entity(author).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Integer id, Author author) {
        return authorRepository.findByIdOptional(id)
                .map(existing -> {
                    existing.setName(author.getName());
                    return Response.ok(existing).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Integer id) {
        boolean deleted = authorRepository.deleteById(id);
        return deleted
                ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }
}
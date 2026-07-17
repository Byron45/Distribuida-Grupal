package com.programacion.distribuida.books.rest;

import com.programacion.distribuida.books.clients.AuthorRestClient;
import com.programacion.distribuida.books.db.Book;
import com.programacion.distribuida.books.dtos.BookDto;
import com.programacion.distribuida.books.repo.BookRepository;
import com.programacion.distribuida.books.repo.InventoryRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.net.URI;
import java.util.List;

@Path("/books")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookRest {

    @Inject
    BookRepository bookRepository;

    @Inject
    InventoryRepository inventoryRepository;

    @Inject
    @RestClient
    AuthorRestClient authorRestClient;

    private BookDto toDto(Book book) {
        var authors = authorRestClient.findByBook(book.getIsbn());
        var inventory = inventoryRepository.findByIdOptional(book.getIsbn());

        return BookDto.builder()
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .price(book.getPrice())
                .authors(authors)
                .inventorySold(inventory.map(it -> it.getSold()).orElse(0))
                .inventorySupplied(inventory.map(it -> it.getSupplied()).orElse(0))
                .build();
    }

    @GET
    public List<BookDto> getAll() {
        return bookRepository.listAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @GET
    @Path("/{isbn}")
    public Response getByIsbn(@PathParam("isbn") String isbn) {
        return bookRepository.findByIdOptional(isbn)
                .map(this::toDto)
                .map(Response::ok)
                .orElse(Response.status(Response.Status.NOT_FOUND))
                .build();
    }

    @POST
    @Transactional
    public Response create(Book book) {
        bookRepository.persist(book);
        return Response.created(URI.create("/books/" + book.getIsbn()))
                .entity(book)
                .build();
    }

    @PUT
    @Path("/{isbn}")
    @Transactional
    public Response update(@PathParam("isbn") String isbn, Book book) {
        return bookRepository.findByIdOptional(isbn)
                .map(existing -> {
                    existing.setTitle(book.getTitle());
                    existing.setPrice(book.getPrice());
                    return Response.ok(existing).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @DELETE
    @Path("/{isbn}")
    @Transactional
    public Response delete(@PathParam("isbn") String isbn) {
        boolean deleted = bookRepository.deleteById(isbn);
        return deleted
                ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }
}
package com.programacion.distribuida.authors.db;

import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "books_authors")
@Getter
@Setter
@ToString
public class BookAuthor {

    @EmbeddedId
    private BookAuthorId id;

    @ManyToOne
    @JoinColumn(name = "authors_id", insertable = false, updatable = false)
    @ToString.Exclude
    private Author author;
}
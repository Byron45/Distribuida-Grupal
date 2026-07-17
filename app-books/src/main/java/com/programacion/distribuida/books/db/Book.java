package com.programacion.distribuida.books.db;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "books")
@Getter
@Setter
@ToString
public class Book {

    @Id
    private String isbn;
    private String title;
    private Double price;

    @Version
    private Integer version;
}
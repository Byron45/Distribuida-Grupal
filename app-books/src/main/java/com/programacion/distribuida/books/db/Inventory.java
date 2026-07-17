package com.programacion.distribuida.books.db;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@ToString
public class Inventory {

    @Id
    @Column(name = "book_isbn")
    private String bookIsbn;

    private Integer sold;
    private Integer supplied;

    @Version
    private Integer version;

    @OneToOne
    @JoinColumn(name = "book_isbn", insertable = false, updatable = false)
    @ToString.Exclude
    private Book book;
}
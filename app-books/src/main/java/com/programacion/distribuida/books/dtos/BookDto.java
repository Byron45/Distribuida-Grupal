package com.programacion.distribuida.books.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Builder
public class BookDto {
    private String isbn;
    private String title;
    private Double price;
    private List<AuthorDto> authors;
    private Integer inventorySold;
    private Integer inventorySupplied;
}
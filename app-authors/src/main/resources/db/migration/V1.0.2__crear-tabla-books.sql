CREATE TABLE books
(
    isbn    VARCHAR(255)     NOT NULL,
    price   DOUBLE PRECISION NOT NULL,
    title   VARCHAR(255),
    version INTEGER          NOT NULL,
    CONSTRAINT pk_books PRIMARY KEY (isbn)
);

CREATE TABLE inventory
(
    book_isbn VARCHAR(255) NOT NULL,
    sold      INTEGER      NOT NULL,
    supplied  INTEGER      NOT NULL,
    version   INTEGER      NOT NULL,
    CONSTRAINT pk_inventory PRIMARY KEY (book_isbn)
);

insert into books (isbn, price, title, version)
values ('459-0789985456', 15.99, 'Indigenista Huasipungo', 1),
       ('459-0137898004', 25.00, 'Cumandá', 1),
       ('459-0599766256', 20.90, 'Los Sangurimas', 1),
       ('459-0894045777', 10.50, 'Las cruces sobre el agua', 1);


insert into inventory (book_isbn, sold, supplied, version)
values ('459-0789985456', 15, 80, 1),
       ('459-0137898004', 50, 25, 1),
       ('459-0599766256', 3, 70, 1),
       ('459-0894045777', 10, 45, 1);
create table datasets
(
    id          int unsigned auto_increment
        primary key,
    title       varchar(255)                       not null,
    content     text                               not null,
    vector      json                               null,
    token_count int unsigned                       null,
    created_at  datetime default CURRENT_TIMESTAMP null,
    updated_at  datetime                           null on update CURRENT_TIMESTAMP,
    vectored_at datetime                           null
);

create index datasets_vectored_at_updated_at_index
    on datasets (vectored_at, updated_at);


create table datasets
(
    id                  int unsigned auto_increment
        primary key,
    title               varchar(255)                       not null,
    content             text                               not null,
    content_hash        varchar(64)                        not null,
    vector_content_hash varchar(64)                        null,
    vectors             json                               null,
    token_count         int unsigned                       null,
    created_at          datetime default CURRENT_TIMESTAMP null,
    updated_at          datetime                           null on update CURRENT_TIMESTAMP,
    vectored_at         datetime                           null on update CURRENT_TIMESTAMP
);

create index datasets_content_hash_index
    on contents (content_hash);

create index datasets_vector_content_hash_index
    on contents (vector_content_hash);

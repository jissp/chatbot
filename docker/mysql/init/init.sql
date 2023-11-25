create table contents
(
    id                  integer unsigned auto_increment,
    content             text                                  not null,
    content_hash        varchar(64)                           not null,
    vector_content_hash varchar(64) default null              null,
    vectors             json        default null              null,
    created_at          datetime    default current_timestamp null,
    updated_at          datetime    default null              null on update current_timestamp,
    vectored_at         datetime    default null              null on update current_timestamp,
    constraint contents_pk
        primary key (id)
);

create index contents_content_hash_index
    on contents (content_hash);

create index contents_vector_content_hash_index
    on contents (vector_content_hash);


create table "users" (
  id varchar(256) primary key not null,
  email varchar(256) not null,
  picture text not null,
  nickname varchar(128) not null
);

create table "videos" (
  id bigserial primary key not null,
  title varchar(255) not null,
  "createdat" timestamp not null default now(),
  "modifiedAt" timestamp not null default now(),
  duration float not null,
  description text,
  visibility varchar(32) not null default false,
  "authorid" integer not null,
  views integer not null,
  foreign key ("id") references "users"(id),
  segmentcount integer not null,
  thumbnail text not null
);

create table "versions" (
  id bigserial primary key not null,
  foreign key ("videoId") references "bken"."videos"(id),
  cmd text not null,
  ext varchar(4) not null,
  link text not null,
  preset varchar(64) not null,
  segmentsCompleted integer not null,
  status varchar(32) not null
);
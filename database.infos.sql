CREATE TABLE "public"."database_infos" (
  "id" int4 NOT NULL DEFAULT nextval('"public".database_infos_id_seq'::regclass),
  "name" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "host" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "port" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "username" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "database" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "add_time" timestamp(6) NOT NULL,
  "update_time" timestamp(6) NOT NULL,
  CONSTRAINT "pk_database_infos" PRIMARY KEY ("id")
);
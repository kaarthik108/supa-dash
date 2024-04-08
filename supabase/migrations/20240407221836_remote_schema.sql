
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

CREATE OR REPLACE FUNCTION "public"."f_search_documents"("query_embedding" "public"."vector", "match_count" integer DEFAULT NULL::integer, "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" bigint, "content" "text", "metadata" "jsonb", "embedding" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (search_documents.embedding <=> query_embedding) as similarity
  from search_documents
  where metadata @> filter
  order by search_documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

ALTER FUNCTION "public"."f_search_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."k1_match_documents"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (k1_documents.embedding <=> query_embedding) as similarity
  from k1_documents
  where metadata @> filter
  order by k1_documents.embedding <=> query_embedding;
end;
$$;

ALTER FUNCTION "public"."k1_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer) RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "embedding" "public"."vector", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
           # variable_conflict use_column
       BEGIN
           RETURN query
           SELECT
               id,
               content,
               metadata,
               embedding,
               1 -(documents.embedding <=> query_embedding) AS similarity
           FROM
               documents
           ORDER BY
               documents.embedding <=> query_embedding
           LIMIT match_count;
       END;
       $$;

ALTER FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_ex_documents"("query_embedding" "public"."vector", "match_count" integer) RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "embedding" "public"."vector", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
           # variable_conflict use_column
       BEGIN
           RETURN query
           SELECT
               id,
               content,
               metadata,
               embedding,
               1 -(ex_documents.embedding <=> query_embedding) AS similarity
           FROM
               ex_documents
           ORDER BY
               ex_documents.embedding <=> query_embedding
           LIMIT match_count;
       END;
       $$;

ALTER FUNCTION "public"."match_ex_documents"("query_embedding" "public"."vector", "match_count" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."pdf_match_documents"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$ #variable_conflict use_column
begin return query
select id,
    content,
    metadata,
    1 - (pdf_documents.embedding <=> query_embedding) as similarity
from pdf_documents
where metadata @> filter
order by pdf_documents.embedding <=> query_embedding;
END;
$$;

ALTER FUNCTION "public"."pdf_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."requesting_user_id"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;

ALTER FUNCTION "public"."requesting_user_id"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."v_match_documents"("query_embedding" "public"."vector", "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding;
end;
$$;

ALTER FUNCTION "public"."v_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."campaign" (
    "CampaignID" bigint NOT NULL,
    "StartDate" "text",
    "EndDate" "text",
    "Budget" double precision,
    "Platform" "text",
    "ContentID" bigint,
    "ContentType" "text",
    "AudienceType" "text",
    "Impressions" bigint,
    "Clicks" bigint,
    "NewSubscriptions" bigint,
    "Subscription Cost" bigint,
    "Revenue" bigint
);

ALTER TABLE "public"."campaign" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" "text" NOT NULL,
    "user_id" "text" DEFAULT "public"."requesting_user_id"() NOT NULL,
    "payload" "jsonb"
);

ALTER TABLE "public"."chats" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector"(1536)
);

ALTER TABLE "public"."documents" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."ex_documents" (
    "id" "uuid" NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector"(1536)
);

ALTER TABLE "public"."ex_documents" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."k1_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector"(1536)
);

ALTER TABLE "public"."k1_documents" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."pdf_documents" (
    "id" "uuid" NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector"(1536),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."pdf_documents" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."search_documents" (
    "id" bigint NOT NULL,
    "content" "text",
    "metadata" "jsonb",
    "embedding" "public"."vector"(256)
);

ALTER TABLE "public"."search_documents" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."search_documents_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."search_documents_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."search_documents_id_seq" OWNED BY "public"."search_documents"."id";

CREATE TABLE IF NOT EXISTS "public"."subscriber" (
    "SubscriberID" "text" NOT NULL,
    "CampaignID" bigint,
    "SubscriptionDate" "date",
    "Age" bigint,
    "Gender" "text",
    "Location" "text",
    "AudienceType" "text",
    "Satisfaction" "text",
    "SubscriptionDays" bigint,
    "EngagementRate" bigint,
    "ViewingTime" bigint
);

ALTER TABLE "public"."subscriber" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."subscriber_aggregated_data" AS
 SELECT "s"."CampaignID",
    "s"."SubscriberID",
    "s"."Satisfaction",
    "s"."EngagementRate",
    "s"."ViewingTime",
    "s"."SubscriptionDate",
    "s"."Location",
    "s"."Age",
    "c"."ContentType",
    "c"."Platform",
    "c"."Revenue",
    "c"."Impressions",
    "c"."NewSubscriptions",
    "c"."Clicks",
    "c"."AudienceType",
    "c"."Budget",
    "c"."StartDate",
    "to_char"("date_trunc"('month'::"text", ("to_date"("c"."StartDate", 'DD.MM.YYYY'::"text"))::timestamp with time zone), 'Mon'::"text") AS "CampaignMonth"
   FROM ("public"."campaign" "c"
     JOIN "public"."subscriber" "s" ON (("s"."CampaignID" = "c"."CampaignID")));

ALTER TABLE "public"."subscriber_aggregated_data" OWNER TO "postgres";

ALTER TABLE ONLY "public"."search_documents" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."search_documents_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."campaign"
    ADD CONSTRAINT "campaign_pkey" PRIMARY KEY ("CampaignID");

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."ex_documents"
    ADD CONSTRAINT "ex_documents_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."k1_documents"
    ADD CONSTRAINT "k1_documents_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."pdf_documents"
    ADD CONSTRAINT "pdf_documents_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."search_documents"
    ADD CONSTRAINT "search_documents_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscriber"
    ADD CONSTRAINT "subscriber_pkey" PRIMARY KEY ("SubscriberID");

CREATE INDEX "documents_embedding_idx" ON "public"."documents" USING "hnsw" ("embedding" "public"."vector_ip_ops");

CREATE INDEX "documents_embedding_idx1" ON "public"."documents" USING "hnsw" ("embedding" "public"."vector_cosine_ops");

CREATE INDEX "k1_documents_embedding_idx" ON "public"."k1_documents" USING "hnsw" ("embedding" "public"."vector_cosine_ops");

CREATE INDEX "search_documents_embedding_idx" ON "public"."search_documents" USING "hnsw" ("embedding" "public"."vector_cosine_ops");

ALTER TABLE ONLY "public"."subscriber"
    ADD CONSTRAINT "public_subscriber_CampaignID_fkey" FOREIGN KEY ("CampaignID") REFERENCES "public"."campaign"("CampaignID");

CREATE POLICY "Allow public read for shared chats" ON "public"."chats" FOR SELECT USING ((("payload" ->> 'sharePath'::"text") IS NOT NULL));

CREATE POLICY "Authenticated users can manage their own chats" ON "public"."chats" USING ((("auth"."role"() = 'authenticated'::"text") AND ("public"."requesting_user_id"() = "user_id")));

CREATE POLICY "Enable read access for all users" ON "public"."campaign" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."subscriber" FOR SELECT USING (true);

ALTER TABLE "public"."campaign" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subscriber" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chats";

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."f_search_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."f_search_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."f_search_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."k1_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."k1_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."k1_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."match_ex_documents"("query_embedding" "public"."vector", "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_ex_documents"("query_embedding" "public"."vector", "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_ex_documents"("query_embedding" "public"."vector", "match_count" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."pdf_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."pdf_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pdf_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "service_role";

GRANT ALL ON FUNCTION "public"."v_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."v_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."v_match_documents"("query_embedding" "public"."vector", "filter" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "service_role";

GRANT ALL ON TABLE "public"."campaign" TO "anon";
GRANT ALL ON TABLE "public"."campaign" TO "authenticated";
GRANT ALL ON TABLE "public"."campaign" TO "service_role";

GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";

GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";

GRANT ALL ON TABLE "public"."ex_documents" TO "anon";
GRANT ALL ON TABLE "public"."ex_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."ex_documents" TO "service_role";

GRANT ALL ON TABLE "public"."k1_documents" TO "anon";
GRANT ALL ON TABLE "public"."k1_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."k1_documents" TO "service_role";

GRANT ALL ON TABLE "public"."pdf_documents" TO "anon";
GRANT ALL ON TABLE "public"."pdf_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."pdf_documents" TO "service_role";

GRANT ALL ON TABLE "public"."search_documents" TO "anon";
GRANT ALL ON TABLE "public"."search_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."search_documents" TO "service_role";

GRANT ALL ON SEQUENCE "public"."search_documents_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."search_documents_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."search_documents_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."subscriber" TO "anon";
GRANT ALL ON TABLE "public"."subscriber" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriber" TO "service_role";

GRANT ALL ON TABLE "public"."subscriber_aggregated_data" TO "anon";
GRANT ALL ON TABLE "public"."subscriber_aggregated_data" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriber_aggregated_data" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;

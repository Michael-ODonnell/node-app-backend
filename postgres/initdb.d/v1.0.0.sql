BEGIN;

CREATE EXTENSION "uuid-ossp";

CREATE SCHEMA live_data;

CREATE ROLE read_write_role;
CREATE ROLE read_only_role;
GRANT CONNECT ON DATABASE postgres TO read_write_role;
GRANT USAGE ON SCHEMA live_data TO read_write_role;
GRANT CONNECT ON DATABASE postgres TO read_only_role;
GRANT USAGE ON SCHEMA live_data TO read_only_role;

GRANT SELECT, INSERT, UPDATE, DELETE 
    ON ALL TABLES IN SCHEMA live_data 
    TO read_write_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA live_data
   GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO read_write_role;

GRANT SELECT
    ON ALL TABLES IN SCHEMA live_data 
    TO read_only_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA live_data
   GRANT SELECT ON TABLES TO read_only_role;

CREATE USER api WITH PASSWORD 'api_password';
GRANT read_write_role TO api;
CREATE USER viewer WITH PASSWORD 'viewer';
GRANT read_only_role TO viewer;

CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TABLE live_data.users 
(
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    username text NOT NULL,
    created timestamp default now(),
    last_modified timestamp default now(),

    CONSTRAINT pkey_tbl PRIMARY KEY ( id )
);

CREATE TRIGGER update_user_modified BEFORE UPDATE ON live_data.users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE SCHEMA meta_data;
CREATE TABLE meta_data.migrations 
(
    script text NOT NULL,
    md5 uuid NOT NULL,
    applied timestamp default now(),

    CONSTRAINT pkey_tbl PRIMARY KEY ( script )
);

COMMIT;
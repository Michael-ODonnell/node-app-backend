BEGIN;

ALTER TABLE live_data.users RENAME TO account;
ALTER TABLE live_data.account 
DROP CONSTRAINT pkey_tbl,
ADD COLUMN email text NOT NULL,
ADD COLUMN password text NOT NULL,
ADD COLUMN salt text NOT NULL,
DROP COLUMN id,
ADD CONSTRAINT live_data_user_pkey PRIMARY KEY ( email );

ALTER TABLE meta_data.migrations
DROP COLUMN md5,
ADD COLUMN hash text NOT NULL;

COMMIT;

-- UNDO 
-- BEGIN;

-- ALTER TABLE meta_data.migrations
-- DROP COLUMN HASH,
-- ADD COLUMN md5 uuid NOT NULL;

-- ALTER TABLE live_data.account 
-- DROP CONSTRAINT live_data_user_pkey,
-- ADD COLUMN id text NOT NULL,
-- DROP COLUMN salt,
-- DROP COLUMN password,
-- DROP COLUMN email,
-- ADD CONSTRAINT pkey_tbl PRIMARY KEY ( id );

-- ALTER TABLE live_data.account 
-- RENAME TO users;

-- COMMIT;

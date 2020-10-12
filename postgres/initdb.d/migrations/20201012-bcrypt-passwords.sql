BEGIN;

ALTER TABLE live_data.account 
ADD COLUMN hash text NOT NULL,
DROP COLUMN password,
DROP COLUMN salt;

COMMIT;

-- UNDO 
-- BEGIN;

-- ALTER TABLE live_data.account 
-- ADD COLUMN salt text NOT NULL,
-- ADD COLUMN password text NOT NULL,
-- DROP COLUMN hash;

-- COMMIT;

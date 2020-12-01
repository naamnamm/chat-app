DO
$do$
BEGIN
	RAISE NOTICE 'BEGIN: Remove username column from messages table';
	IF EXISTS (SELECT * FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'username') 
	THEN	   
		RAISE NOTICE '\tColumn "username" does not exist.  Removing column';
		ALTER TABLE messages DROP COLUMN username;
	ELSE
		RAISE NOTICE '\tColumn "username" does not exist.  No action was necessary.';
	END IF;	

  

END
$do$
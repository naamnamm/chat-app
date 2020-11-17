CREATE DATABASE chatapp;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION generate_uid(size INT) RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  bytes BYTEA := gen_random_bytes(size);
  l INT := length(characters);
  i INT := 0;
  output TEXT := '';
BEGIN
  WHILE i < size LOOP
    output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  current_channel TEXT NOT NULL
);

CREATE TABLE channels (
  channel_id TEXT PRIMARY KEY DEFAULT generate_uid(5),
  channel_name TEXT NOT NULL
);

CREATE TABLE messages (
  message_id TEXT PRIMARY KEY DEFAULT generate_uid(15),
  user_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  message_text TEXT NOT NULL
);

ALTER TABLE messages ADD COLUMN channel_name TEXT NOT NULL

INSERT INTO users (user_name, user_password) VALUES ('ben', '123');

INSERT INTO channels (channel_name) VALUES ('General');

SELECT * FROM users;
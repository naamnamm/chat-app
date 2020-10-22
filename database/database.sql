CREATE DATABASE chatApp;

CREATE TABLE usertable (
  userid SERIAL PRIMARY KEY,
  username VARCHAR(255),
  userpassword VARCHAR(255)
);
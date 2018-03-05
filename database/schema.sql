--These schemas can be used for your local mySql server

CREATE DATABASE IF NOT EXISTS marlowe;

USE marlowe;

CREATE TABLE provider (
  id INTEGER AUTO_INCREMENT NOT NULL,
  providerUsername VARCHAR(16),
  pPassword VARCHAR(16),
  PRIMARY KEY(id)
);

CREATE TABLE claimer (
  id INTEGER AUTO_INCREMENT NOT NULL,
  claimerUsername VARCHAR(16),
  claimerZipCode INTEGER NOT NULL,
  cPassword VARCHAR(16),
  PRIMARY KEY (id)
);

CREATE TABLE post (
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(100),
  username VARCHAR(20),
  description VARCHAR(255),
  address VARCHAR(50),
  city VARCHAR(25),
  state VARCHAR(2),
  zipCode VARCHAR(6),
  phone VARCHAR(12),
  isClaimed BOOLEAN,
  emailAddress VARCHAR(50),
  createdAt INTEGER,
  photoUrl VARCHAR(512),
  PRIMARY KEY (id)
)

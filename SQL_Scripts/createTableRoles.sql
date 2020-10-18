CREATE TABLE roles (
  name VARCHAR(40) UNIQUE NOT NULL,
  description TEXT,
  PRIMARY KEY (name)
);
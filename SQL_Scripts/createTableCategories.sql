CREATE TABLE categories (
  ID INT NOT NULL AUTO_INCREMENT,  
  name VARCHAR(64) UNIQUE NOT NULL,  
  description TEXT,  
  PRIMARY KEY (ID)
);
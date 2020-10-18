CREATE TABLE status (
    statusID INT NOT NULL AUTO_INCREMENT, 
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    PRIMARY KEY (statusID)
);
CREATE TABLE properties (
    prop_ID INT NOT NULL AUTO_INCREMENT, 
    price INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    visibility BOOLEAN DEFAULT TRUE,
    highPriority BOOLEAN DEFAULT FALSE, 
    sellerID INT NOT NULL,
    buyerID INT,
    dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (prop_ID),
    FOREIGN KEY (sellerID) REFERENCES users (userID),
    FOREIGN KEY (buyerID) REFERENCES users (userID),
    FOREIGN KEY (status) REFERENCES status (name)
);


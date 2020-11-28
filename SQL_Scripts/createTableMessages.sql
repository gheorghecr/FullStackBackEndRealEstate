CREATE TABLE messages (
    messageID INT NOT NULL AUTO_INCREMENT, 
    fromEmail VARCHAR(50)  NOT NULL,
    fromName VARCHAR(50)  NOT NULL,
    fromNumber VARCHAR(50),
    agentID INT NOT NULL,
    propertyID INT,
    messageText TEXT NOT NULL, 
    archived BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (messageID),
    FOREIGN KEY (propertyID) REFERENCES properties (prop_ID) ON DELETE CASCADE,
    FOREIGN KEY (agentID) REFERENCES users (userID) ON DELETE CASCADE
);

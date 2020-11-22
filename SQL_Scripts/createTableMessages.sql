CREATE TABLE messages (
    messageID INT NOT NULL AUTO_INCREMENT, 
    fromID INT  NOT NULL,
    toID INT NOT NULL,
    propertyID INT,
    conversationID INT,
    messageText TEXT NOT NULL, 
    archived BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (messageID),
    FOREIGN KEY (fromID) REFERENCES users (userID) ON DELETE CASCADE,
    FOREIGN KEY (propertyID) REFERENCES properties (prop_ID) ON DELETE CASCADE,
    FOREIGN KEY (toID) REFERENCES users (userID) ON DELETE CASCADE
);

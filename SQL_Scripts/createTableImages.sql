CREATE TABLE propertiesImages (
    imageID INT NOT NULL AUTO_INCREMENT,
    prop_ID INT NOT NULL, 
    imageName VARCHAR(150) NOT NULL,
    dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (imageID),
    FOREIGN KEY (prop_ID) REFERENCES properties (prop_ID)
);
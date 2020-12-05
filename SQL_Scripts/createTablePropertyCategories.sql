CREATE TABLE propertyCategories (
  propertyCategoryID INT NOT NULL AUTO_INCREMENT,
  propertyID INT NOT NULL,
  categoryID INT NOT NULL,
  FOREIGN KEY (propertyID) REFERENCES properties (prop_ID) ON DELETE CASCADE,
  FOREIGN KEY (categoryID) REFERENCES categories (ID) ON DELETE CASCADE,
  PRIMARY KEY (propertyCategoryID)
);
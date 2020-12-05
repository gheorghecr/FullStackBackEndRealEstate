CREATE TABLE propertyFeatures (
  propertyFeatureID INT NOT NULL AUTO_INCREMENT,
  propertyID INT NOT NULL,
  featureID INT NOT NULL,
  FOREIGN KEY (propertyID) REFERENCES properties (prop_ID) ON DELETE CASCADE,
  FOREIGN KEY (featureID) REFERENCES features (ID) ON DELETE CASCADE,
  PRIMARY KEY (propertyFeatureID)
);
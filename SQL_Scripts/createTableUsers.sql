CREATE TABLE users (
    userID INT NOT NULL AUTO_INCREMENT, 
    username VARCHAR(50) UNIQUE NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    passwordSalt VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    avatarURL VARCHAR(200), 
    role VARCHAR(100) DEFAULT 'user',
    signUpCode VARCHAR(50) DEFAULT 'we_sell_houses_agent',
    dateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (userID),
    FOREIGN KEY (role) REFERENCES roles (name)
);


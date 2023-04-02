CREATE DATABASE IF NOT EXISTS ai;

USE ai;

CREATE TABLE IF NOT EXISTS Accounts(
    AccountID INT NOT NULL AUTO_INCREMENT,
    AccountName VARCHAR(128) NOT NULL,
    Premium BIT DEFAULT FALSE,
    PRIMARY KEY (AccountID)
);

INSERT INTO Accounts(AccountName)
VALUES ("Andersen Job"), ("Andrew Smith")
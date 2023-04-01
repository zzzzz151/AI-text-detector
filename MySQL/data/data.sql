CREATE DATABASE IF NOT EXISTS ai_text_detector_DB;

USE ai_text_detector_DB;

CREATE TABLE IF NOT EXISTS Accounts (
    id INT PRIMARY KEY,
    acc_name VARCHAR(256),
    email VARCHAR(256),
    premium BIT DEFAULT 0
);

INSERT INTO Accounts (id, acc_name, email, premium)
VALUES (57,"Admin", "admin@root.com", 1);
-- Create a new table called 'usersFavoriteGames' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('usersFavoriteGames', 'U') IS NOT NULL
DROP TABLE usersFavoriteGames
GO
-- Create the table in the specified schema
CREATE TABLE usersFavoriteGames
(
    userID INT NOT NULL FOREIGN KEY REFERENCES users(userID),
    gameID INT NOT NULL FOREIGN KEY REFERENCES games(gameID),
    -- -- primary key column
    PRIMARY KEY(userID, gameID)
    -- specify more columns here
);
GO
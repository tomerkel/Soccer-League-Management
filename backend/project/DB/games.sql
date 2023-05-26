-- Create a new table called 'games' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('games', 'U') IS NOT NULL
DROP TABLE games
GO
-- Create the table in the specified schema
CREATE TABLE games
(
    gameID INT IDENTITY(1,1) PRIMARY KEY,
    -- primary key column
    gameDateTime SMALLDATETIME NOT NULL,
    homeTeamID INT NOT NULL,
    awayTeamID INT NOT NULL,
    stadium [NVARCHAR](50) NOT NULL,
    homeGoals INT,
    awayGoals INT,
    refereeID INT NOT NULL FOREIGN KEY REFERENCES referees(refereeID)
    -- specify more columns here
);
GO
-- Create a new table called 'gamesEvents' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.gamesEvents', 'U') IS NOT NULL
DROP TABLE dbo.gamesEvents
GO
-- Create the table in the specified schema
CREATE TABLE dbo.gamesEvents
(
    eventID INT IDENTITY(1,1) PRIMARY KEY,
    -- primary key column
    gameID INT NOT NULL FOREIGN KEY REFERENCES games(gameID),
    gameDate [NVARCHAR](50) NOT NULL,
    gameHour [NVARCHAR](50) NOT NULL,
    gameMinute INT NOT NULL,
    eventType [NVARCHAR](50) NOT NULL,
    description [NVARCHAR](50) NOT NULL
    -- specify more columns here
);
GO
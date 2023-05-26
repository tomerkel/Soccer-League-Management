-- Create a new table called 'associationRepresentatives' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('associationRepresentatives', 'U') IS NOT NULL
DROP TABLE associationRepresentatives
GO
-- Create the table in the specified schema
CREATE TABLE associationRepresentatives
(
    representativeID INT IDENTITY(1,1) PRIMARY KEY,
    userID INT NOT NULL FOREIGN KEY REFERENCES users(userID),
    -- primary key column
    -- specify more columns here
);
GO
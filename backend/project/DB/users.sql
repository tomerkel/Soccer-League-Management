-- Create a new table called 'users' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('users', 'U') IS NOT NULL
DROP TABLE users
GO
-- Create the table in the specified schema
CREATE TABLE users
(
    userID INT IDENTITY(1,1) PRIMARY KEY,
    -- primary key column
    userName [NVARCHAR](50) NOT NULL UNIQUE,
    hashPassword [NVARCHAR](100) NOT NULL,
    firstName [NVARCHAR](50) NOT NULL,
    lastName [NVARCHAR](50) NOT NULL,
    country [NVARCHAR](50) NOT NULL,
    email [NVARCHAR](320) NOT NULL,
    imageUrl [NVARCHAR](200)
);
GO

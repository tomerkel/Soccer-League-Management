
-- Insert rows into table 'games'
INSERT INTO games
    ( -- columns to insert data into
    [gameDateTime], [homeTeamID], [awayTeamID], [stadium], [homeGoals], [awayGoals], [refereeID]
    )
VALUES
    ( -- first row: values for the columns in the list above
        '05/05/2021 15:00', 85, 939, 'BGU', 2, 2, 1
),
    ( -- second row: values for the columns in the list above
        '05/15/2021 19:00', 293, 390, 'BGU', 0, 3, 2
)
-- add more rows here
GO


-- Insert rows into table 'games'
INSERT INTO games
    ( -- columns to insert data into
    [gameDateTime], [homeTeamID], [awayTeamID], [stadium], [refereeID]
    )
VALUES
    ( -- fourth row: values for the columns in the list above
        '08/01/2021 17:00', 1020, 293, 'BGU', 1
),
    ( --  fifth row: values for the columns in the list above
        '08/20/2021 18:30', 85, 939, 'BGU', 2
),
    ( --  sixth row: values for the columns in the list above
        '10/03/2021 17:00', 939, 390, 'BGU', 1
)
-- add more rows here
GO

-- Insert rows into table 'gamesEvents'
INSERT INTO gamesEvents
    ( -- columns to insert data into
    [gameID], [gameDate], [gameHour], [gameMinute], [eventType], [description]
    )
VALUES
    ( -- first Game events: values for the columns in the list above
        1, '05/05/2021', '15:00', 45, 'Goal', 'Goal for team 85'
),
    (
        1, '05/05/2021', '15:00', 70, 'Goal', 'Goal for team 939'
),
    (
        1, '05/05/2021', '15:00', 75, 'Yellow Card', 'Yellow Card for team 85'
),
    (
        1, '05/05/2021', '15:00', 80, 'Injury', 'Player 1 of team 85 injured'
),
    ( -- second Game events: values for the columns in the list above
        2, '05/15/2021', '19:00', 20, 'Injury', 'Player 3 of team 293 injured'
),
    (
        2, '05/15/2021', '19:00', 35, 'Foul', 'Foul for player 11 of team 390'
),
    (
        2, '05/15/2021', '19:00', 60, 'Substitution', 'Player 5 of team 293 was substituted'
)

-- add more rows here
GO


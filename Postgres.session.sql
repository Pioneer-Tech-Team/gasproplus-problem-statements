DROP TABLE IF EXISTS accounts CASCADE;
CREATE EXTENSION IF NOT EXISTS ltree;
--
CREATE TABLE IF NOT EXISTS accounts(
id INT PRIMARY KEY NOT NULL,
name TEXT NOT NULL,
parent_id INT,
is_group BOOLEAN
);
--
INSERT INTO accounts (id, parent_id, is_group, name) VALUES
(1, NULL, true, 'Assets'),
(2, NULL, true, 'Liability'),
(3, NULL, true, 'Income'),
(4, NULL, true, 'Expenses'),
(5, 1, false, 'Cash'),
(6, 1, true, 'Bank'),
(7, 6, false, 'Bank of India'),
(8, 6, false, 'ICICI'),
(9, 6, false, 'HDFC'),
(10, 2, true, 'Loans'),
(11, 10, true, 'Bank Loans'),
(12, 11, false, 'Bank of Baroda A/c no 24136589'),
(13, 11, false, 'ICICI Bank A/c no 334968531666');
--
\echo
\echo Accounts table schema
\echo
SELECT
column_name,
data_type,
character_maximum_length,
is_nullable,
column_default
FROM information_schema.columns
WHERE table_name = 'accounts';
--
\echo
\echo Accounts table data
\echo
SELECT * FROM accounts;
--
CREATE VIEW account_hierarchy AS
WITH RECURSIVE account_tmp AS (
    -- Set root accounts level to 1
    SELECT id,
        parent_id,
        is_group,
        name,
        text2ltree(id::TEXT) AS path,
        1 AS level
    FROM accounts
    WHERE parent_id IS NULL
    UNION ALL
    -- Generate path for every account and add level for each hierarchy split
    SELECT a.id,
        a.parent_id,
        a.is_group,
        a.name,
        text2ltree(ac.path::TEXT || '.' || a.id::TEXT) AS path,
        ac.level + 1 AS level -- Increment the level for each child
    FROM accounts a
        INNER JOIN account_tmp ac ON a.parent_id = ac.id
)
SELECT id,
    parent_id,
    is_group,
    name,
    path,
    level
FROM account_tmp
ORDER BY path;
--
\echo
\echo View ordered by hierarchy
\echo
SELECT id, parent_id, is_group, name FROM account_hierarchy ORDER BY path;
--
\echo
\echo View with visual representation of hierarchy
\echo
SELECT
-- Show hierarchy status by prepending tabs before name
repeat(E'\t', level - 1) || name AS indented_name
FROM account_hierarchy
ORDER BY path;

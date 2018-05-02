--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE User (
  id   INTEGER      PRIMARY KEY,
  cid  VARCHAR(10)  NOT NULL,
  name VARCHAR(100)
);

CREATE TABLE Subject (
  id    INTEGER PRIMARY KEY,
  uid   INTEGER NOT NULL,
  label TEXT    NOT NULL,
  CONSTRAINT Subject_fk_uid FOREIGN KEY (uid)
    REFERENCES User (id) ON UPDATE CASCADE ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE User;
DROP TABLE Subject;

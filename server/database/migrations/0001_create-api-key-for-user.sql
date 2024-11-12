-- Migration number: 0001 	 2024-11-12T05:03:27.242Z
CREATE TABLE userToken (
	id INTEGER,
	userId TEXT NOT NULL,
	token TEXT NOT NULL,
	enabled INTEGER NOT NULL,
	createDate TEXT NOT NULL,
	deleteDate TEXT NOT NULL,
  PRIMARY KEY (id)
  FOREIGN KEY (userId) 
    REFERENCES user (id) 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION,
);
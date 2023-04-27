/* eslint-disable prettier/prettier */
import SQLite from 'react-native-sqlite-storage';

// Open a database
const db = SQLite.openDatabase(
  {name: 'MobileBanking.db', location: 'default'},
  () => console.log('Database opened successfully.'),
  error => console.error('Failed to open database: ', error),
);

// Insert a new row into the 'utilizatori' table
export const insertUtilizator = (Nume, Prenume, CNP_utilizator, Adresa) => {
  db.transaction(txn => {
    txn.executeSql(
      'INSERT INTO utilizatori (codUtilizator, Nume, Prenume, CNP_utilizator, Adresa) VALUES (?, ?, ?, ?,?)',
      [Nume, Prenume, CNP_utilizator, Adresa],
      (_, result) => {
        console.log('Inserted row with codUtilizator:', result.insertId);
      },
      error => console.error('Failed to insert row: ', error),
    );
  });
};

// Insert a new row into the 'conturi' table
export const insertCont = (IBAN_cont, codUtilizator, Sold_cont, Data_creare_cont) => {
  db.transaction(txn => {
    txn.executeSql(
      'INSERT INTO conturi (IBAN_cont, codUtilizator, Sold_cont, Data_creare_cont) VALUES (?, ?, ?, ?)',
      [IBAN_cont, codUtilizator, Sold_cont, Data_creare_cont],
      (_, result) => {
        console.log('Inserted row with IBAN_cont:', IBAN_cont);
      },
      error => console.error('Failed to insert row: ', error),
    );
  });
};

// Fetch all rows from the 'utilizatori' table
export const fetchUtilizatori = () => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM utilizatori',
      [],
      (_, result) => {
        console.log('Fetched rows from utilizatori:', result.rows.raw());
      },
      error => console.error('Failed to fetch rows: ', error),
    );
  });
};

// Fetch all rows from the 'conturi' table
export const fetchConturi = () => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT * FROM conturi',
      [],
      (_, result) => {
        console.log('Fetched rows from conturi:', result.rows.raw());
      },
      error => console.error('Failed to fetch rows: ', error),
    );
  });
};

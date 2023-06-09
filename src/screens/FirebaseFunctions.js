/* eslint-disable prettier/prettier */
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import {db} from './Firebase';

export const addData = async (collectionName, data, options) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data, options);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const fetchData = async collectionName => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return data;
  } catch (e) {
    console.error('Error fetching data: ', e);
  }
};
export const deleteData = async (collectionName, documentId) => {
  try {
    await deleteDoc(doc(collection(db, collectionName), documentId));
    console.log(`${documentId} deleted successfully`);
  } catch (e) {
    console.error('Error deleting data: ', e);
  }
};

export const fetchTransactions = async collectionName => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map(doc => {
      const transaction = doc.data();
      const Data = transaction.Data.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }); // format date as "DD/MM/YY"
      return {id: doc.id, ...transaction, Data};
    });
    return data;
  } catch (e) {
    console.error('Error fetching data: ', e);
    return [];
  }
};

export const fetchTransactionsByDate = async (
  collectionName,
  fromDate,
  toDate,
) => {
  try {
    const fromTimestamp = Timestamp.fromDate(fromDate);
    const toTimestamp = Timestamp.fromDate(
      new Date(toDate.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to toDate
    );

    const q = query(
      collection(db, collectionName),
      where('Data', '>=', fromTimestamp),
      where('Data', '<', toTimestamp), // Use "<" instead of "<="
    );
    const querySnapshot = await getDocs(q);
    // Map the query results to an array of transaction objects with formatted dates
    const data = querySnapshot.docs.map(doc => {
      const transaction = doc.data();
      const Data = transaction.Data.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }); // format date as "DD/MM/YY" if transaction.Data exists
      return {id: doc.id, ...transaction, Data};
    });
    return data;
  } catch (e) {
    console.error('Error fetching data: ', e);
    return [];
  }
};
export const fetchTransactionsByAccount = async (collectionName, accountId) => {
  try {
    const q = query(
      collection(db, collectionName),
      where('IBAN_cont', '==', accountId),
    );
    const querySnapshot = await getDocs(q);

    // Map the query results to an array of transaction objects with formatted dates
    const data = querySnapshot.docs.map(doc => {
      const transaction = doc.data();
      const Data = transaction.Data.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }); // format date as "DD/MM/YY" if transaction.Data exists
      return {id: doc.id, ...transaction, Data};
    });

    return data;
  } catch (e) {
    console.error('Error fetching data: ', e);
    return [];
  }
};

export const updateSold = async (accountId, amount) => {
  try {
    const accountRef = doc(db, 'conturi', accountId);
    await runTransaction(db, async transaction => {
      const accountSnapshot = await transaction.get(accountRef);
      const accountData = accountSnapshot.data();
      if (accountData) {
        transaction.update(accountRef, {Sold: parseFloat(amount)});
      } else {
        throw new Error(`Account with ID ${accountId} not found`);
      }
    });
  } catch (error) {
    console.error('Error updating account amount:', error);
    throw error;
  }
};

// export default insertData;
// export const fetchUsers = async () => {
//   try {
//     const usersCollection = db.collection('utilizatori');
//     const querySnapshot = await usersCollection.get();
//     querySnapshot.forEach(doc => {
//       console.log(doc.id, ' => ', doc.data());
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//   }
// };
// export async function insertUser(){
//   try {
//     const docRef = await setDoc(doc(db, 'utilizatori', 'utilizator_nou'), {
//       ID_utilizator: '1',
//       Nume: 'Doe',
//       Prenume: 'John',
//       CNP: '1234567890123',
//       Adresa: 'Some address',
//     });
//     console.log('Document written with ID: ', docRef.id);
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
//   console.log(collection(db, 'utilizatori'));
// }

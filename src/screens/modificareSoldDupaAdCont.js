/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  setID,
  setTransactions,
  setAccID,
  setNewAccounts,
} from '../../redux/actions';
import {
  addData,
  fetchData,
  fetchTransactions,
  fetchTransactionsByDate,
  updateSold,
} from './FirebaseFunctions';
import firebase from 'firebase/compat';
export const setAccTransaction = ({}) => {
  const timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    try {
      var Transaction = {
        ID_utilizator: 1,
        IBAN_cont: ibanContCurent,
        IBAN_DC: IBAN,
        Nume_DC: name,
        Suma: suma,
        Desc: desc,
        Data: timestamp,
        Adresa: adresa,
        este_plata: tipTranzactie,
      };

      addData('tranzactii', Transaction);
    } catch (error) {
      console.log(error);
    }
  };

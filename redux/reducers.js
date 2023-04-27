/* eslint-disable prettier/prettier */
import {
  SET_TRANSACTION_DATE,
  SET_TRANSACTION_ID,
  SET_TRANSACTION,
  SET_ACCOUNT_ID,
  SET_ACCOUNT,
} from './actions';

const initialState = {
  accounts: [],
  transactions: [],
  accID: 1,
  transactionID: 1,
  date: '',
};

function transactionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TRANSACTION:
      return {...state, transactions: action.payload};
    case SET_TRANSACTION_DATE:
      return {...state, date: action.payload};
    case SET_TRANSACTION_ID:
      return {...state, id: action.payload};
    case SET_ACCOUNT:
      return {...state, accounts: action.payload};
    case SET_ACCOUNT_ID:
      return {...state, accID: action.payload};
    default:
      return state;
  }
}
export default transactionReducer;


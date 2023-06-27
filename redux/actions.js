/* eslint-disable prettier/prettier */
export const SET_TRANSACTION_ID = 'SET_TRANSACTION_ID';
export const SET_TRANSACTION_DATE = 'SET_TRANSACTION_DATE';
export const SET_TRANSACTION = 'SET_TRANSACTION';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_FURNIZORI = 'SET_FURNIZORI';
export const SET_ACCOUNT_ID = 'SET_ACCOUNT_ID';

export const setID = id => dispatch => {
  dispatch({
    type: SET_TRANSACTION_ID,
    payload: id,
  });
};
export const setDate = date => dispatch => {
  dispatch({
    type: SET_TRANSACTION_DATE,
    payload: date,
  });
};

export const setTransactions = transactions => dispatch => {
  dispatch({
    type: SET_TRANSACTION,
    payload: transactions,
  });
};
export const setNewAccounts = accounts => dispatch => {
  dispatch({
    type: SET_ACCOUNT,
    payload: accounts,
  });
};
export const setFurnizori = furnizori => dispatch => {
  dispatch({
    type: SET_FURNIZORI,
    payload: furnizori,
  });
};
export const setAccID = accID => dispatch => {
  dispatch({
    type: SET_ACCOUNT_ID,
    payload: accID,
  });
};

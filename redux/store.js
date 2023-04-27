/* eslint-disable prettier/prettier */
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import transactionReducer from './reducers';

const rootReducer = combineReducers({transactionReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));

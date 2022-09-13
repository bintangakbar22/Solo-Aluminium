import {applyMiddleware, combineReducers, createStore} from 'redux';
import Thunk from 'redux-thunk';
import Reducer from '../reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
const Reducers = {
  appData: Reducer,
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const configPersist = persistReducer(persistConfig, combineReducers(Reducers));

const Store = createStore(configPersist, applyMiddleware(Thunk));
export const PersistStore = persistStore(Store);
export default Store;

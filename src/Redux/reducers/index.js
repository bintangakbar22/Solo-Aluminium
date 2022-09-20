import {
  FETCH_LOGIN,
  GET_USER_DATA,
  UPDATE_USER_DATA,
  LOGOUT,
  CONNECTED,
  NOT_CONNECTED,
  GET_CATEGORY,
  GET_ALL_USER,
  GET_ALL_IN_PRODUCTS,
  GET_ALL_OUT_PRODUCTS,
  GET_TOTAL_INCOME,
  GET_TOTAL_EXPENSE,
  GET_PRODUCT,
  FINANCE_SCREEN,
  GET_TRANSACTIONS
} from '../types';
const initialState = {
  connection: false,
  loginUser: null,
  userData: {},
  accessToken:null,
  idUser :null,
  category:[],
  transactions:[],
  allUser:[],
  products:[],
  allProductsIn:[],
  allProductsOut:[],
  totalIncome:0,
  totalExpense:0,
  financeScreen:'Product',
  transactions:[]
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {

    case CONNECTED:
      return {
        ...state,
        connection: true,
      };

    case NOT_CONNECTED:
      return {
        ...state,
        connection: false,
      };

    case FINANCE_SCREEN:
      return {
        ...state,
        financeScreen: action.payload,
      };

    case FETCH_LOGIN:
      return {
        ...state,
        loginUser: action.payload,
        userData : action.userData,
        accessToken:action.accessToken,
        idUser : action.idUser
      };
      
    case GET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
      
    case LOGOUT:
      return {
        ...state,
        loginUser: null,
        userData: null,
        accessToken:null,
        idUser:null
      };

    case GET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };

    case GET_ALL_USER:
      return {
        ...state,
        allUser: action.payload,
      };

    case GET_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };

    case GET_ALL_IN_PRODUCTS:
      return {
        ...state,
        allProductsIn: action.payload,
      };

    case GET_ALL_OUT_PRODUCTS:
      return {
        ...state,
        allProductsOut: action.payload,
      };

    case GET_TOTAL_INCOME:
      return {
        ...state,
        totalIncome: action.payload,
      };

    case GET_TOTAL_EXPENSE:
      return {
        ...state,
        totalExpense: action.payload,
      };

    case GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };
    
    default:
      return state;
  }
};

export default Reducer;

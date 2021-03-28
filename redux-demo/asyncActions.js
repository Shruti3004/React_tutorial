const redux = require('redux');
const thunkMiddleware = require('redux-thunk')
const axios = require('axios');

const applyMiddleware = redux.applyMiddleware
const createStore = redux.createStore();

const initialState = {
    loading: false,
    users: [],
    error: ''
}

const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

const fetchUsersRequest = () => {
    return {
        type: 'FETCH_USERS_REQUEST',
    }
}
const fetchUsersSuccess = (users) => {
    return {
        type: 'FETCH_USERS_SUCCESS',
        payload: users
    }
}
const fetchUsersFailure = (error) => {
    return {
        type: 'FETCH_USERS_FAILURE',
        payload: error
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_USERS_REQUEST: 
            return{
                ...state,
                loading: true
            }
        case FETCH_USERS_SUCCESS: 
            return{                
                loading: false,
                users: action.payload,
                error: ''
            }
        case FETCH_USERS_FAILURE: 
            return{
                ...state,
                loading: false,
                users: [],
                error: action.payload
            }
    }
}

// redux thunk allows action-creater to return function instead of action 
const fetchUsers = () => {
    return function(diapatch){
        dispatch(fetchUsersRequest())
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                const users = response.data.map(user => user.id)
                dispatch(fetchUsersSuccess(users))
            })
            .catch(error => {
                dispatch(fetchUsersFailure(error.message))
            })
    }
}
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
store.subscribe(() => {console.log(store.getState())})
store.diapatch(fetchUsers())
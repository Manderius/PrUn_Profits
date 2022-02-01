import { createStore } from 'redux'
import rootReducer from './reducers'

const defaultState = {}

const savedState = localStorage.getItem('reduxState')
    ? JSON.parse(localStorage.getItem('reduxState'))
    : defaultState

// const savedState = defaultState;

const store = createStore(rootReducer, savedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
});

export default store;
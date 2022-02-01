import { combineReducers } from "redux";
import shopping from '../components/shopping/shopping-list/ShoppingList.reducer'
import data from '../data/DataLoader.reducer'

function rootReducer(state = { exchange: 'AI1', buildings: ['BMP', 'REF', 'FP', 'PP1', 'CHP'] }, action) {
    return state;
}

export default combineReducers({ preferences: rootReducer, shopping, data }); 
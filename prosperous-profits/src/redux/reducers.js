import { combineReducers } from "redux";
import shopping from '../components/shopping/shopping-list/ShoppingList.reducer'

function rootReducer(state = { result: '' }, action) {
    return state;
}

export default combineReducers({ rootReducer, shopping }); 
import { ShoppingListItem } from 'classes/ShoppingListItem';
import { ShoppingListAction } from './ShoppingListEnums';

export default function reduce(state = { items: [] }, action) {
    let copy = {
        ...state
    }
    switch (action.type) {
        case ShoppingListAction.ADD_ITEM:
            if (!copy.items.some(item => item.ticker === action.payload.ticker)) {
                copy.items.push(new ShoppingListItem(action.payload.ticker, 1, action.payload.orderType))
            }
            break;
        case ShoppingListAction.REMOVE_ITEM:
            copy.items = copy.items.filter(item => item.ticker !== action.payload.ticker);
            break;
        default:
            return state;
    }
    console.log(state);
    return copy;
}
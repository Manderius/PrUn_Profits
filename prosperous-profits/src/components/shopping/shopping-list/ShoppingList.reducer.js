import { ShoppingListItem } from 'classes/ShoppingListItem';
import { ShoppingListAction, ShoppingType } from './ShoppingListEnums';

export default function reduce(state = { buying: [], selling: [] }, action) {
    if (action.payload === undefined) return state;

    let items = action.payload.orderType === ShoppingType.BUYING ? state.buying.slice() : state.selling.slice();
    switch (action.type) {
        case ShoppingListAction.ADD_ITEM:
            if (!items.some(item => item.ticker === action.payload.ticker)) {
                const largestId = (items.length > 0) ? items[items.length - 1].id : 1;
                items.push(new ShoppingListItem(largestId + 1, action.payload.ticker, action.payload.amount, action.payload.orderType))
            }
            break;
        case ShoppingListAction.REMOVE_ITEM:
            items = items.filter(item => item.id !== action.payload.id);
            break;
        default:
            return state;
    }


    if (action.payload.orderType === ShoppingType.BUYING) {
        return {
            ...state,
            buying: items
        }
    }
    else {
        return {
            ...state,
            selling: items
        }
    }
}
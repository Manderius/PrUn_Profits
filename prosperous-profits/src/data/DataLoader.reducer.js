import { DataLoaderEnums } from "./DataLoaderConstants";

export default function reduce(state = { materials: [], prices: [] }, action) {
    if (action.payload === undefined) return state;

    let data = {};
    switch (action.type) {
        case DataLoaderEnums.EXCHANGE_DATA:
            data.exchange_data = action.payload;
            break;
        default:
            return state;
    }

    return {
        ...state,
        ...data
    }
}
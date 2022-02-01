import { DataLoaderEnums } from "./DataLoaderConstants";

export default function reduce(state = { buildings: [], prices: [] }, action) {
    if (action.payload === undefined) return state;

    let data = {};
    switch (action.type) {
        case DataLoaderEnums.EXCHANGE_DATA:
            data.exchange_data = action.payload;
            break;
        case DataLoaderEnums.BUILDING_DATA:
            data.buildings = action.payload;
            break;
        case DataLoaderEnums.PRICE_DATA:
            data.prices = action.payload;
            break;
        default:
            return state;
    }

    return {
        ...state,
        ...data
    }
}
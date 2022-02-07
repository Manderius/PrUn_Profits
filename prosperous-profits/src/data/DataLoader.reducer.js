import { DataLoaderEnums } from "./DataLoaderConstants";

export default function reduce(state = { buildings: [], prices: [], materials: [], categories: [] }, action) {
    if (action.payload === undefined) return state;

    let data = {};
    switch (action.type) {
        case DataLoaderEnums.BUILDING_DATA:
            data.buildings = action.payload;
            break;
        case DataLoaderEnums.PRICE_DATA:
            data.prices = action.payload;
            break;
        case DataLoaderEnums.MATERIAL_DATA:
            data.materials = action.payload;
            break;
        case DataLoaderEnums.CATEGORY_DATA:
            data.categories = action.payload;
            break;
        default:
            return state;
    }

    return {
        ...state,
        ...data
    }
}
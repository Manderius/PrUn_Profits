import { ItemPriceRecord } from 'classes/ItemPriceRecord';
import store from '../redux/store'
import { DataLoaderConstants, DataLoaderEnums } from './DataLoaderConstants';

export function loadLocalData() {
    loadBuildings();
    loadMaterials();
    loadCategories();
}

function loadBuildings() {
    var buildings = require('../assets/buildings.json');
    store.dispatch({ type: DataLoaderEnums.BUILDING_DATA, payload: buildings });
}

function loadMaterials() {
    var materials = require('../assets/materials.json');
    store.dispatch({ type: DataLoaderEnums.MATERIAL_DATA, payload: materials });
}

function loadCategories() {
    var categories = require('../assets/categories.json');
    store.dispatch({ type: DataLoaderEnums.CATEGORY_DATA, payload: categories });
}

//#region Exchange data

function parsePriceData(exchangeData) {
    const result = { 'AI1': {}, 'IC1': {}, 'CI1': {}, 'NC1': {}, 'CI2': {}, 'NC2': {} };
    exchangeData.forEach((record) => {
        const itemPrice = new ItemPriceRecord(record.MaterialTicker, record.Ask, record.Bid, record.SellingOrders, record.BuyingOrders);
        result[record.ExchangeCode][record.MaterialTicker] = itemPrice;
    })

    store.dispatch({ type: DataLoaderEnums.PRICE_DATA, payload: result })
}

export function loadExchangeData() {
    makeRequest(DataLoaderConstants.API_HOST, DataLoaderConstants.EXCHANGE_DATA_URL, (data) => {
        parsePriceData(data);
    });
}

//#endregion

//#region Helper functions

function makeRequest(host, path, callback) {
    fetch(host + path)
        .then(res => res.json())
        .then(callback);
}

//#endregion
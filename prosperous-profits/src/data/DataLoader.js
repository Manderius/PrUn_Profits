import { ItemPriceRecord } from 'classes/ItemPriceRecord';
import store from '../redux/store'
import { DataLoaderConstants, DataLoaderEnums } from './DataLoaderConstants';

export function loadLocalData() {
    var buildings = require('../assets/buildings.json')
    store.dispatch({ type: DataLoaderEnums.BUILDING_DATA, payload: buildings })
}

//#region Exchange data

function parsePriceData(exchangeData) {
    const result = { 'AI1': {}, 'IC1': {}, 'CI1': {}, 'NC1': {} };
    exchangeData.forEach((record) => {
        const itemPrice = new ItemPriceRecord(record.MaterialTicker, record.Ask, record.Bid, record.SellingOrders, record.BuyingOrders);
        result[record.ExchangeCode][record.MaterialTicker] = itemPrice;
    })
    console.log(result['AI1']['STR'])
    store.dispatch({ type: DataLoaderEnums.PRICE_DATA, payload: result })
}

export function loadExchangeData() {
    makeRequest(DataLoaderConstants.API_HOST, DataLoaderConstants.EXCHANGE_DATA_URL, (data) => {
        store.dispatch({ type: DataLoaderEnums.EXCHANGE_DATA, payload: data });
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
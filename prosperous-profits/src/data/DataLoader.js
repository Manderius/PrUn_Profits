import store from '../redux/store'
import { DataLoaderConstants, DataLoaderEnums } from './DataLoaderConstants';

//#region Exchange data

export function loadExchangeData() {
    console.log("Request for data")
    getFullExchangeData().then(data => {
        store.dispatch({ type: DataLoaderEnums.EXCHANGE_DATA, payload: data })
    });
}

function getFullExchangeData() {
    return new Promise((resolve, reject) => {
        makeRequest(DataLoaderConstants.API_HOST, DataLoaderConstants.EXCHANGE_DATA_URL, (data) => {
            resolve(data)
        });
    })

}

//#endregion

//#region Helper functions

function makeRequest(host, path, callback) {
    fetch(host + path)
        .then(res => res.json())
        .then(callback);
}

//#endregion
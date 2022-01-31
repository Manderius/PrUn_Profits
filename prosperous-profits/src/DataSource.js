//var fs = require('fs');

class DataSource {
    static localExchange = "AI1"
    static APIhost = 'https://rest.fnar.net'
    static MARKET_MAKER_AMOUNT = 1000000;
    static MESSAGES = {
        NO_BUYERS: "No buyers",
        MARKET_MAKER: "Market maker"
    }

    getAllRecipes() {
        return require('./assets/recipes-combined.json')
    }

    getRecipesData() {
        return new Promise((resolve, reject) => {
            this.getFullExchangeData().then(this.parsePricesFromFullData.bind(this)).then(this.getProfitabilities.bind(this)).then(resolve);
        })
    }

    getFullExchangeData() {
        return new Promise((resolve, reject) => {
            makeRequest(DataSource.APIhost, '/exchange/full', (data) => {
                resolve(data)
            });
        })

    }

    getProfitability(recipe, prices) {
        var materialCost = recipe.Inputs.map((input) => getMaterialPrice(input.Ticker, true, prices) * input.Amount).reduce(function (a, b) { return a + b; }, 0);
        var gain = recipe.Outputs.map((input) => getSellingPrice(input, prices) * input.Amount).reduce(function (a, b) { return a + b; }, 0);
        var askGain = recipe.Outputs.map((input) => getMaterialPrice(input.Ticker, true, prices) * input.Amount * 0.9).reduce(function (a, b) { return a + b; }, 0);
        if (askGain < gain) askGain = gain;
        var worth = Math.round((gain - materialCost) / recipe.TimeMs * 1000 * 60 * 1000) / 1000;
        var askWorth = Math.round((askGain - materialCost) / recipe.TimeMs * 1000 * 60 * 1000) / 1000;
        var isInputAvailable = recipe.Inputs.map((input) => isMaterialAvailable(input.Ticker, prices, true)).every((elem) => elem);
        var isOutputSellable = recipe.Outputs.map((input) => isMaterialAvailable(input.Ticker, prices, false)).every((elem) => elem);
        var isMMSellable = recipe.Outputs.map((input) => isMarketMakerSellable(input.Ticker, prices)).every((elem) => elem);
        var result = { 'Name': recipe.RecipeName, Inputs: recipe.Inputs, Outputs: recipe.Outputs, TimeMs: recipe.TimeMs, 'Ratio': isInputAvailable ? worth : 0, 'AskSellRatio': isInputAvailable ? askWorth : 0 }
        if (!isOutputSellable) {
            result.Message = DataSource.MESSAGES.NO_BUYERS;
        }
        if (isMMSellable) {
            result.Message = DataSource.MESSAGES.MARKET_MAKER;
        }
        return result;
    }

    getProfitabilities(prices) {
        var allRecipes = this.getAllRecipes()
        var result = []
        allRecipes.forEach((buildingRecipes) => {
            var tmp = { 'Building': buildingRecipes.BuildingTicker, 'Profits': [] };
            buildingRecipes.Recipes.forEach((recipe) => {
                var profit = this.getProfitability(recipe, prices)
                tmp.Profits.push(profit)
            })
            result.push(tmp)
        })
        return result
    }

    parsePricesFromFullData(input) {
        var pricesData = []
        var data = this.getExchangeMaterialsData(input)
        for (const material of data.values()) {
            for (var exchange of material.ExchangeData) {
                if (exchange.ExchangeCode != DataSource.localExchange) continue;
                pricesData.push({ 'Ticker': material.Material, 'BuyingOrders': exchange.BuyingOrders, 'SellingOrders': exchange.SellingOrders, 'Ask': exchange.Ask })
            }
        }
        return pricesData;
    }

    getExchangeMaterialsData(input) {
        var allEx = input;
        var pricesMap = new Map()
        allEx.forEach((record) => {
            var buyOrders = getClosePrices(record.BuyingOrders, false)
            var sellOrders = getClosePrices(record.SellingOrders, true)
            if (buyOrders.Amount == 0 && sellOrders.Amount == 0) {
                return
            }
            if (!pricesMap.has(record.MaterialTicker)) {
                pricesMap.set(record.MaterialTicker, { 'Material': record.MaterialTicker, 'ExchangeData': [] })
            }
            var data = pricesMap.get(record.MaterialTicker)
            var lastAsk = record.Ask;
            data.ExchangeData.push({ 'ExchangeCode': record.ExchangeCode, 'BuyingOrders': buyOrders, 'SellingOrders': sellOrders })
            pricesMap.set(record.MaterialTicker, data)
        })
        return pricesMap;
    }

    getProfitableTrading() {
        var priceMap = this.getExchangeMaterialsData()
        var trades = []
        for (const material of priceMap.values()) {
            for (var exchange of material.ExchangeData) {
                var purchasingPrice = exchange.SellingOrders.Price;
                for (var sellExchange of material.ExchangeData) {
                    var sellingPrice = sellExchange.BuyingOrders.Price;
                    if (purchasingPrice < sellingPrice * 0.9 && purchasingPrice > 0 && sellingPrice > 0) {
                        trades.push({
                            'Material': material.Material,
                            'BuyAt': exchange.ExchangeCode, 'BuyFor': purchasingPrice, 'BuyMax': exchange.SellingOrders.Amount,
                            'SellAt': sellExchange.ExchangeCode, 'SellFor': sellingPrice, 'SellMax': sellExchange.BuyingOrders.Amount,
                            'ProfitRatio': Math.round(100 * sellingPrice / purchasingPrice) / 100,
                            'MaxBuy': Math.round(purchasingPrice * Math.min(sellExchange.BuyingOrders.Amount, exchange.SellingOrders.Amount)),
                            'MaxProfitNet': Math.round((sellingPrice - purchasingPrice) * Math.min(sellExchange.BuyingOrders.Amount, exchange.SellingOrders.Amount))
                        })
                    }
                }
            }
        }

        return trades
    }

}

export default DataSource;
//exports.DataSource = DataSource;

function makeRequest(host, path, callback) {
    fetch(host + path)
        .then(
            res => res.json())
        .then(callback);
}


function getMaterials(recipeArr, output) {
    let materials = new Set();
    recipeArr.forEach((recipes) => {
        recipes.forEach((recipe) => {
            recipe.Inputs.forEach((input) => materials.add(input.Ticker))
            recipe.Outputs.forEach((input) => materials.add(input.Ticker))
        })
    });
    // console.log(materials.values())
    // writeToFile(output, JSON.stringify(Array.from(materials)));
}

// function addBuilding(code) {
//     filterRecipes(code)
//     var allRecipes = getAllRecipes()
//     allRecipes = allRecipes.map((build) => build.Recipes);
//     getMaterials(allRecipes, './all-materials.json')
// }


function getClosePrices(orders, isSellOrder) {
    if (orders.length == 0) return { 'Price': 0, 'Amount': 0 };
    orders.sort((a, b) => { return isSellOrder ? a.ItemCost - b.ItemCost : b.ItemCost - a.ItemCost })
    var price = orders[0].ItemCost;
    var rangeHigh = price * 1.1;
    var rangeLow = price * 0.9;
    var total = 0;
    var containsMarketMakerOrder = false;
    orders.filter((o) => o.ItemCost < rangeHigh && o.ItemCost > rangeLow).forEach((o) => {
        if (o.ItemCount == null) containsMarketMakerOrder = true;
        total += o.ItemCount;
    })
    if (containsMarketMakerOrder) total = DataSource.MARKET_MAKER_AMOUNT;

    return { 'Price': price, 'Amount': total }
}

// function getPrices(materials) {
//     if (materials.length == 0) return;
//     var ticker = materials.pop();
//     getPrice(ticker, (data) => {
//         data = JSON.parse(data)
//         var buyOrders = getClosePrices(data.BuyingOrders, false)
//         var sellOrders = getClosePrices(data.SellingOrders, true)
//         if (buyOrders === false || sellOrders === false) {
//             getPrices(materials)
//             return
//         }
//         var item = { 'ticker': ticker, "BuyingOrders": buyOrders, "SellingOrders": sellOrder }
//         prices.push(item);
//         getPrices(materials)
//     });
// }

// function getPrice(ticker, callback) {
//     makeRequest(APIhost, '/exchange/' + ticker + '.' + exchange, callback);
// }

// var allMaterials = require('./all-materials.json')
// getPrices(allMaterials)

function getMaterialPrice(ticker, isBuying, prices) {
    var material = prices.find((mat) => mat.Ticker == ticker);
    if (!material) return 0;
    return isBuying ? material.SellingOrders.Price : material.BuyingOrders.Price;
}

function isMarketMakerSellable(ticker, prices) {
    var material = prices.find((mat) => mat.Ticker == ticker);
    if (!material) return false;
    return material.BuyingOrders.Amount == DataSource.MARKET_MAKER_AMOUNT;
}


function getSellingPrice(material, prices) {
    var price = getMaterialPrice(material.Ticker, false, prices);
    return (price > 0) ? price : getMaterialPrice(material.Ticker, true, prices) * 0.9;
}

function isMaterialAvailable(ticker, prices, forBuying) {
    var material = prices.find((mat) => mat.Ticker == ticker);
    // console.log('Checking if ' + ticker + ' is available> ' + material)
    if (!material) return false;
    var canBuy = material.SellingOrders.Amount > 0;
    var canSell = material.BuyingOrders.Amount > 0;
    return forBuying ? canBuy : canSell;
}

// pp1.forEach((recipe) => getProfitability(recipe))



// function getGoodTrades(from, to, minProfit = 1.2) {
//     var goodTrades = getProfitableTrading()
//     goodTrades = goodTrades.filter((trade) => trade.BuyAt == from)
//     goodTrades = goodTrades.filter((trade) => trade.ProfitRatio > minProfit)
//     goodTrades = goodTrades.filter((trade) => trade.SellAt == to)
//     console.log(goodTrades)
// }



// function getTodayProfitablesInner(buildingCodes, threshold, showUnsellable) {
//     var profits = getProfitabilities();
//     profits.forEach((data) => {
//         if (!buildingCodes || buildingCodes.includes(data.Building)) {
//             console.log(data.Building)
//             data.Profits.forEach((profit) => {
//                 if (profit.Ratio < threshold) return;
//                 if (profit.Message && profit.Message == MESSAGES.NO_BUYERS && !showUnsellable) return;
//                 console.log(profit)
//             })
//         }
//     })
// }

// function getTodayProfitables(buildingCodes, threshold = 0.5, showUnsellable = false) {
//     var minCreationTime = new Date();
//     minCreationTime.setHours(minCreationTime.getHours() - 4);
//     var fileTime = new Date(2000, 1);
//     if (fs.existsSync('exchange-full-formatted.json')) {
//         fileTime = fs.statSync('exchange-full-formatted.json').mtime;
//     }
//     if (minCreationTime > fileTime) {
//         getFullExchangeData(() => {
//             parsePricesFromFullData();
//             getTodayProfitablesInner(buildingCodes, threshold, showUnsellable);
//         })
//     }
//     else {
//         getTodayProfitablesInner(buildingCodes, threshold, showUnsellable);
//     }
// }


// function writeToFile(path, contents) {
//     fs.writeFileSync(path, contents);
// }



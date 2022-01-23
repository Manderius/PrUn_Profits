var fs = require('fs');

var localExchange = "AI1"
var APIhost = 'rest.fnar.net'

function makeRequest(host, path, callback) {
    var https = require('https');
    var url = {
        host: host,
        port: 443,
        path: path,
        headers: {
          'accept': 'application/json'
        },
      };
      https.get(url, function(resp){
        //console.log("Status: " + resp.statusCode);
        if (resp.statusCode != 200) console.log("Status: " + resp.statusCode)
        resp.setEncoding('utf8');
        var completeResponse = '';
        resp.on('data', function (chunk) {
          completeResponse += chunk;
        });
        resp.on('end', function(chunk) {
          callback(completeResponse);
        });
      });
}

function loadRecipes() {
    makeRequest(APIhost, '/recipes/allrecipes', (data) => {writeToFile('all2.json', data);})
}

function filterRecipes(buildingCode) {
    var all = require('./recipes/all.json')
    var recipes = all.filter((e) => e.BuildingTicker == buildingCode)
    writeToFile('recipes/' + buildingCode + '.json', JSON.stringify(recipes, null, 2))
}

// 

function getAllRecipes() {
    var all = []
    fs.readdirSync('recipes').forEach(file => {
        if (file == 'all.json') return;
        var code = file.split('.')[0];
        all.push({ 'BuildingTicker': code, 'Recipes': require('./recipes/' + file)})
    });
    return all;
}

function getMaterials(recipeArr, output) {
    materials = new Set();
    recipeArr.forEach((recipes) => {
        recipes.forEach((recipe) => {
            recipe.Inputs.forEach((input) => materials.add(input.Ticker))
            recipe.Outputs.forEach((input) => materials.add(input.Ticker))
        })
    });
    // console.log(materials.values())
    writeToFile(output, JSON.stringify(Array.from(materials)));
}

function addBuilding(code) {
    filterRecipes(code)
    var allRecipes = getAllRecipes()
    allRecipes = allRecipes.map((build) => build.Recipes);
    getMaterials(allRecipes, './all-materials.json')
}


function getClosePrices(orders, isSellOrder) {
    if (orders.length == 0) return { 'Price': 0, 'Amount': 0};
    orders.sort((a, b) => { return isSellOrder ? a.ItemCost - b.ItemCost : b.ItemCost - a.ItemCost})
    var price = orders[0].ItemCost;
    var rangeHigh = price * 1.1;
    var rangeLow = price * 0.9;
    var total = 0;
    orders.filter((o) => o.ItemCost < rangeHigh && o.ItemCost > rangeLow).forEach((o) => {
        total += o.ItemCount;
    })
    
    return { 'Price': price, 'Amount': total }
}

function getPrices(materials) {
    if (materials.length == 0) return;
    var ticker = materials.pop();
    getPrice(ticker, (data) => {
        data = JSON.parse(data)
        var buyOrders = getClosePrices(data.BuyingOrders, false)
        var sellOrders = getClosePrices(data.SellingOrders, true)
        if (buyOrders === false || sellOrders === false) {
            getPrices(materials)
            return
        }
        var item = { 'ticker': ticker, "BuyingOrders": buyOrders, "SellingOrders": sellOrders} 
        prices.push(item);
        writeToFile('prices.json', JSON.stringify(Array.from(prices), null, 2));
        getPrices(materials)
    });
}

function getPrice(ticker, callback) {
    makeRequest(APIhost, '/exchange/' + ticker + '.' + exchange, callback);
}

// var allMaterials = require('./all-materials.json')
// getPrices(allMaterials)

function getMaterialPrice(ticker, isBuying, prices) {
    var material = prices.find((mat) => mat.Ticker == ticker);
    if (!material) return 0;
    return isBuying ? material.SellingOrders.Price : material.BuyingOrders.Price;
}

function getProfitability(recipe) {
    var prices = require('./prices.json');
    var materialCost = recipe.Inputs.map((input) => getMaterialPrice(input.Ticker, true, prices) * input.Amount).reduce(function(a, b) { return a + b; }, 0);
    var gain = recipe.Outputs.map((input) => getSellingPrice(input, prices) * input.Amount).reduce(function(a, b) { return a + b; }, 0);
    var worth = Math.round((gain - materialCost) / recipe.TimeMs * 1000 * 60 * 1000) / 1000
    var isInputAvailable = recipe.Inputs.map((input) => isMaterialAvailable(input.Ticker, prices, true)).every((elem) => elem);
    var isOutputSellable = recipe.Outputs.map((input) => isMaterialAvailable(input.Ticker, prices, false)).every((elem) => elem);
    if (!isOutputSellable) return { 'Name' : recipe.RecipeName, 'Ratio' : isInputAvailable ? worth : 0, 'Message' : 'No buyers' };
    return { 'Name' : recipe.RecipeName, 'Ratio' : isInputAvailable ? worth : 0}
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

function getProfitabilities() {
    var allRecipes = getAllRecipes()
    var result = []
    allRecipes.forEach((buildingRecipes) => {
        var tmp = { 'Building': buildingRecipes.BuildingTicker, 'Profits' : []};
        //console.log(buildingRecipes.BuildingTicker)
        buildingRecipes.Recipes.forEach((recipe) => {
            var profit = getProfitability(recipe)
            tmp.Profits.push(profit)
        })
        result.push(tmp)
    })
    return result
}

// getProfitabilities()

function getExchangeMaterialsData() {
    var allEx = require('./exchange-full-formatted.json')
    var pricesMap = new Map()
    allEx.forEach((record) => {
        var buyOrders = getClosePrices(record.BuyingOrders, false)
        var sellOrders = getClosePrices(record.SellingOrders, true)
        if (buyOrders.Amount == 0 && sellOrders.Amount == 0) {
            return
        }
        if (!pricesMap.has(record.MaterialTicker)) {
            pricesMap.set(record.MaterialTicker, { 'Material': record.MaterialTicker, 'ExchangeData' : [] })
        }
        var data = pricesMap.get(record.MaterialTicker)
        data.ExchangeData.push({ 'ExchangeCode' : record.ExchangeCode, 'BuyingOrders' : buyOrders, 'SellingOrders' : sellOrders})
        pricesMap.set(record.MaterialTicker, data)
    })
    return pricesMap;
}

function getProfitableTrading() {
    var priceMap = getExchangeMaterialsData()
    var trades = []
    for (const material of priceMap.values()) {
        for (var exchange of material.ExchangeData) {
            var purchasingPrice = exchange.SellingOrders.Price;
            for (var sellExchange of material.ExchangeData) {
                var sellingPrice = sellExchange.BuyingOrders.Price;
                if (purchasingPrice < sellingPrice * 0.9 && purchasingPrice > 0 && sellingPrice > 0) {
                    trades.push({'Material': material.Material,
                                'BuyAt': exchange.ExchangeCode, 'BuyFor' : purchasingPrice, 'BuyMax': exchange.SellingOrders.Amount,
                                'SellAt' : sellExchange.ExchangeCode, 'SellFor': sellingPrice, 'SellMax': sellExchange.BuyingOrders.Amount,
                                'ProfitRatio': Math.round(100 * sellingPrice/purchasingPrice) / 100,
                                'MaxBuy' : Math.round(purchasingPrice * Math.min(sellExchange.BuyingOrders.Amount, exchange.SellingOrders.Amount)),
                                'MaxProfitNet' : Math.round((sellingPrice - purchasingPrice) * Math.min(sellExchange.BuyingOrders.Amount, exchange.SellingOrders.Amount))})
                }
            }
        }
    }
    
    return trades
}

function getGoodTrades(from, to, minProfit = 1.2) {
    var goodTrades = getProfitableTrading()
    goodTrades = goodTrades.filter((trade) => trade.BuyAt == from)
    goodTrades = goodTrades.filter((trade) => trade.ProfitRatio > minProfit)
    goodTrades = goodTrades.filter((trade) => trade.SellAt == to)
    console.log(goodTrades)
}


function getFullExchangeData(callback) {
    makeRequest(APIhost, '/exchange/full', (data) => {
        data = JSON.parse(data)
        writeToFile('exchange-full-formatted.json', JSON.stringify(data, null, 2));
        callback();
    })
}

function parsePricesFromFullData() {
    var pricesData = []
    var data = getExchangeMaterialsData()
    for (const material of data.values()) {
        for (var exchange of material.ExchangeData) {
            if (exchange.ExchangeCode != localExchange) continue;
            pricesData.push({'Ticker' : material.Material, 'BuyingOrders' : exchange.BuyingOrders, 'SellingOrders' : exchange.SellingOrders})
        }
    }
    writeToFile('prices.json', JSON.stringify(pricesData, null, 2));
}

function getTodayProfitablesInner(buildingCodes, threshold) {
    var profits = getProfitabilities();
    profits.forEach((data) => {
        if (!buildingCodes || buildingCodes.includes(data.Building)) {
            console.log(data.Building)
            data.Profits.forEach((profit) => {
                if (profit.Ratio < threshold) return;
                console.log(profit)
            })
        }
    })
}

function getTodayProfitables(buildingCodes, threshold = 0.5) {
    var minCreationTime = new Date();
    minCreationTime.setHours(minCreationTime.getHours() - 4);
    var fileTime = new Date(2000, 1);
    if (fs.existsSync('exchange-full-formatted.json')) {
        fileTime = fs.statSync('exchange-full-formatted.json').mtime;
    }
    if (minCreationTime > fileTime) {
        getFullExchangeData(() => {
            parsePricesFromFullData();
            getTodayProfitablesInner(buildingCodes, threshold);
        })
    }
    else {
        getTodayProfitablesInner(buildingCodes, threshold);
    }
}

// getTodayProfitables(['BMP', 'PP1', 'REF'], 0.5)
// getTodayProfitables(null, 1.2)
// getTodayProfitables(['BMP'], -10)


// getGoodTrades('AI1', 'NC1', 1.5)
// getGoodTrades('NC1', 'AI1', 1.2)



function writeToFile(path, contents) {
    fs.writeFileSync(path, contents);
}

function main(args) {
    if (args.length == 0) {
        getTodayProfitables(['BMP', 'PP1', 'REF', 'FP'], 0.5)
    }
    else if (args[0] == 'trade') {
        var from = args[1];
        var to = args[2];
        var ratio = args.length == 4 ? parseFloat(args[3]) : 1.2;
        getGoodTrades(from, to, ratio)
    }
    else if (args[0] == 'profit') {
        var ratio = args.length == 2 ? parseFloat(args[1]) : 1.2;
        getTodayProfitables(null, ratio)
    }
}

var args = process.argv.slice(2);
main(args)

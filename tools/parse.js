var fs = require('fs');
const buildingsData = require('./buildings-all.json')

function getBuildingTier(building) {
    if (building.Scientists > 0) return 5;
    if (building.Engineers > 0) return 4;
    if (building.Technicians > 0) return 3;
    if (building.Settlers > 0) return 2;
    return 1;
}

function processRecipes(recipes) {
    let result = [];
    recipes.forEach(recipe => {
        const inputs = recipe.Inputs.map(input => { return { 'Ticker': input.CommodityTicker, 'Amount': input.Amount } });
        const outputs = recipe.Outputs.map(output => { return { 'Ticker': output.CommodityTicker, 'Amount': output.Amount } });
        result.push({ Inputs: inputs, Outputs: outputs });
    });
    return result;
}

let parsed = [];
buildingsData.forEach((building) => {
    const newItem = {
        Ticker: building.Ticker,
        Tier: getBuildingTier(building),
        Recipes: processRecipes(building.Recipes)
    }
    parsed.push(newItem);
})

writeToFile('buildings.json', JSON.stringify(parsed, null, 2))

function writeToFile(path, contents) {
    fs.writeFileSync(path, contents);
}
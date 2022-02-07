var fs = require('fs');

//#region Buildings and recipes

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
        result.push({ Inputs: inputs, Outputs: outputs, Time: recipe.DurationMs / 1000 });
    });
    return result;
}

function parseBuildings() {
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
}

//#endregion

//#region Materials

const materialsData = require('./materials-all.json')

function parseMaterials() {
    let parsed = {};
    materialsData.forEach((material) => {
        parsed[material.Ticker] = { Category: material.CategoryName }
    })

    writeToFile('materials-data.json', JSON.stringify(parsed, null, 2))
}

// parseMaterials();

//#endregion

//#region Categories

function createCategories() {
    const materialsParsed = require('./materials-data.json')
    const categories = new Set();
    Object.keys(materialsParsed).forEach(mat => { categories.add(materialsParsed[mat].Category) });
    const tmpArr = Array.from(categories)
    tmpArr.sort()
    const categoryObj = {}
    for (let item of tmpArr) {
        categoryObj[item] = {
            background: '',
            color: ''
        }
    }

    writeToFile('categories.json', JSON.stringify(categoryObj, null, 2))
}

//endregion

function writeToFile(path, contents) {
    fs.writeFileSync(path, contents);
}
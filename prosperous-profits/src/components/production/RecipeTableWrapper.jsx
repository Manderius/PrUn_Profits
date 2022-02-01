import React from 'react';
import { useSelector } from 'react-redux';
import RecipeTable from './recipe-table/RecipeTable';


export const RECIPE_MESSAGES = {
    NO_BUYERS: "No buyers",
    MARKET_MAKER: "Market maker",
    NO_INPUT: "No input"
}

function addItemKeys(data) {
    for (var j = 0; j < data.length; j++) {
        data[j].Key = j;
        for (var i = 0; i < data[j].Recipes.length; i++) {
            data[j].Recipes[i].Key = 1000 * (j + 1) + i;
        }
    }
    return data;
}

function getRecipeProfit(recipe, prices, getSellingPrice) {
    const inputPrices = recipe.Inputs.map(input => prices[input.Ticker].Ask * input.Amount);
    if (inputPrices.some(price => price === 0)) return { Profit: 0, Message: RECIPE_MESSAGES.NO_INPUT };

    const outputPrices = recipe.Outputs.map(output => getSellingPrice(output.Ticker) * output.Amount);
    if (outputPrices.some(price => price === 0)) return { Profit: 0, Message: RECIPE_MESSAGES.NO_BUYERS };

    const sum = (arr) => arr.reduce((partialSum, a) => partialSum + a, 0);
    const profit = (sum(outputPrices) - sum(inputPrices)) / (recipe.Time / 60);
    return { Profit: profit, Message: '' };
}


function addProfits(buildings, prefExchange, prices) {
    if (Object.keys(prices).length === 0) return [];
    buildings = addItemKeys(buildings);
    buildings.forEach(building => {
        building.Recipes.forEach(recipe => {
            const calculation = getRecipeProfit(recipe, prices[prefExchange], (ticker) => prices[prefExchange][ticker].Bid);
            const maxProfit = getRecipeProfit(recipe, prices[prefExchange], (ticker) => prices[prefExchange][ticker].Ask * 0.95);
            recipe.Profit = calculation.Profit;
            recipe.Message = calculation.Message;
            recipe.MaxProfit = Math.max(calculation.Profit, maxProfit.Profit);
        })
    })
    return buildings;
}

export function RecipeTableWrapper() {
    const buildingData = useSelector(state => state.data.buildings);
    const prefExchange = useSelector(state => state.preferences.exchange);
    const prices = useSelector(state => state.data.prices);

    let recipes = addProfits(buildingData, prefExchange, prices);

    return <RecipeTable data={recipes} exchange={prefExchange} />;
}

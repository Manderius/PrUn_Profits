import BuildingTitleRow from "components/production/BuildingTitleRow";
import React from "react";
import { Table } from "react-bootstrap";
import RecipeRow from "./RecipeRow";
import DataSource from "DataSource";
import RecipeFilters from "./RecipeFilters";
import './RecipeTable.css'

const Sort = {
    None: 0,
    Ratio: 1,
    AskRatio: 2
}

class RecipeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], minProfit: -10, onlyWithBuyers: true, buildingFilter: '', onlyPurchaseable: false, sort: Sort.None };
    }

    componentDidMount() {
        const source = new DataSource();
        source.getRecipesData().then((data) => { this.addRecipeKeys(data); });
    }

    addRecipeKeys(data) {
        for (var j = 0; j < data.length; j++) {
            data[j].Key = j;
            for (var i = 0; i < data[j].Profits.length; i++) {
                data[j].Profits[i].Key = 1000 * (j + 1) + i;
            }
        }
        this.updateState({ 'data': data });
    }

    updateState(newItem) {
        this.setState(oldState => {
            let newState = Object.assign({}, oldState)
            newState = Object.assign(newState, newItem);
            return newState;
        });
    }

    filterMinProfit(value) {
        this.updateState({ minProfit: value });
    }

    filterOnlyWithBuyers(onlyWithBuyers) {
        this.updateState({ onlyWithBuyers: onlyWithBuyers });
    }

    filterOnlyPurchaseable(value) {
        this.updateState({ onlyPurchaseable: value });
    }

    filterRecipes(array) {
        let tmp = array.filter(row => row.Ratio >= this.state.minProfit);
        if (this.state.onlyWithBuyers) tmp = tmp.filter(row => row.Message !== 'No buyers');
        if (this.state.onlyPurchaseable) tmp = tmp.filter(row => row.Ratio !== 0);
        return tmp;
    }

    filterBuildings(array) {
        if (this.state.buildingFilter === '') return array;
        return array.filter(building => building.Building.includes(this.state.buildingFilter));
    }

    updateBuildingName(name) {
        this.updateState({ buildingFilter: name.toUpperCase() });
    }

    sortRecipes(recipes) {
        switch (this.state.sort) {
            case Sort.None:
                break;
            case Sort.Ratio:
                recipes.sort((a, b) => b.Ratio - a.Ratio);
                break;
            case Sort.AskRatio:
                recipes.sort((a, b) => b.AskSellRatio - a.AskSellRatio);
                break;
            default:
                break;
        }
    }

    getRows() {
        let buildings = this.state.data.slice();
        buildings = this.filterBuildings(buildings);
        return buildings.map((row, index) => {
            let title = <BuildingTitleRow data={{ 'Title': row.Building }} key={row.Key} />;
            let recipes = this.filterRecipes(row.Profits.slice());
            this.sortRecipes(recipes);
            const recipeRows = recipes.map((profit, i) => <RecipeRow data={profit} key={profit.Key} />);
            return [title, ...recipeRows];
        })
    }

    setSort(newSort) {
        this.updateState({ sort: newSort });
    }

    getClassForHeader(expectedSort) {
        if (this.state.sort === expectedSort) return 'header-selected';
        return '';
    }

    render() {
        return (
            <>
                <RecipeFilters building={this.updateBuildingName.bind(this)} withBuyers={this.filterOnlyWithBuyers.bind(this)} purchaseable={this.filterOnlyPurchaseable.bind(this)} />
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='col-4'>Inputs</th>
                            <th>Output</th>
                            <th>Time</th>
                            <th onClick={() => this.setSort(this.state.sort === Sort.Ratio ? Sort.None : Sort.Ratio)} className={this.getClassForHeader(Sort.Ratio)} >Immediate sell</th>
                            <th onClick={() => this.setSort(this.state.sort === Sort.AskRatio ? Sort.None : Sort.AskRatio)} className={this.getClassForHeader(Sort.AskRatio)} >Sell for Ask</th>
                            <th className='col-2'>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.getRows()
                        }
                    </tbody>
                </Table>
            </>
        )
    }
}

export default RecipeTable;
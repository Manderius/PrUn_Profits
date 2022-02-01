import BuildingTitleRow from "./BuildingTitleRow";
import React from "react";
import { Table } from "react-bootstrap";
import RecipeRow from "./RecipeRow";
import RecipeFilters from "./filters/RecipeFilters";
import './RecipeTable.css'
import { RECIPE_MESSAGES } from "../RecipeTableWrapper";

const Sort = {
    None: 0,
    Ratio: 1,
    AskRatio: 2
}

class RecipeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            minProfit: 0.5,
            minProfitActive: true,
            onlyWithBuyers: true,
            buildingFilter: '',
            displayedBuildings: [],
            onlyPurchaseable: true,
            sort: Sort.None,
            exchange: props.exchange
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data.length !== prevProps.data.length) {
            this.updateState({ data: this.props.data })
        }
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

    filterMinProfitActive(value) {
        this.updateState({ minProfitActive: value });
    }

    filterRecipes(array) {
        let tmp = array;
        if (this.state.minProfitActive) tmp = tmp.filter(row => row.Profit >= this.state.minProfit);
        if (this.state.onlyWithBuyers) tmp = tmp.filter(row => row.Message !== RECIPE_MESSAGES.NO_BUYERS);
        if (this.state.onlyPurchaseable) tmp = tmp.filter(row => row.Message !== RECIPE_MESSAGES.NO_INPUT);
        return tmp;
    }

    filterBuildings(array) {
        array = array.filter(building => this.state.displayedBuildings.length == 0 || this.state.displayedBuildings.includes(building.Ticker));
        return array.filter(building => building.Ticker.includes(this.state.buildingFilter));
    }

    updateBuildingName(name) {
        this.updateState({ buildingFilter: name.toUpperCase() });
    }

    sortRecipes(recipes) {
        switch (this.state.sort) {
            case Sort.None:
                break;
            case Sort.Ratio:
                recipes.sort((a, b) => b.Profit - a.Profit);
                break;
            case Sort.AskRatio:
                recipes.sort((a, b) => b.MaxProfit - a.MaxProfit);
                break;
            default:
                break;
        }
    }

    getRows() {
        let buildings = this.state.data.slice();
        buildings = this.filterBuildings(buildings);
        return buildings.map((row, index) => {
            let title = <BuildingTitleRow data={{ 'Title': row.Ticker, 'Tier': row.Tier }} key={row.Key} />;
            let recipes = this.filterRecipes(row.Recipes.slice());
            this.sortRecipes(recipes);
            const recipeRows = recipes.map((profit, i) => <RecipeRow data={profit} key={profit.Key} />);
            return [title, ...recipeRows];
        })
    }

    setSort(newSort) {
        this.updateState({ sort: newSort });
    }

    setDisplayedBuildings(codes) {
        if (JSON.stringify(codes) === JSON.stringify(this.state.displayedBuildings)) return;
        this.updateState({ displayedBuildings: codes });
    }

    getClassForHeader(expectedSort) {
        if (this.state.sort === expectedSort) return 'header-selected';
        return '';
    }

    render() {
        const actions = {
            buildingName: this.updateBuildingName.bind(this),
            withBuyers: this.filterOnlyWithBuyers.bind(this),
            purchaseable: this.filterOnlyPurchaseable.bind(this),
            minProfitActive: this.filterMinProfitActive.bind(this),
            minProfitValue: this.filterMinProfit.bind(this),
            changeDisplayedBuildings: this.setDisplayedBuildings.bind(this)
        }
        return (
            <>
                <RecipeFilters actions={actions} />
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
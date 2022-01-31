export class ShoppingListItem {
    ticker;
    amount;
    orderType;

    constructor(ticker, amount, orderType) {
        this.ticker = ticker;
        this.amount = amount;
        this.orderType = orderType;
    }
}
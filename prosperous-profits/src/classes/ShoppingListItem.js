export class ShoppingListItem {
    id;
    ticker;
    amount;
    orderType;

    constructor(id, ticker, amount, orderType) {
        this.id = id;
        this.ticker = ticker;
        this.amount = amount;
        this.orderType = orderType;
    }
}